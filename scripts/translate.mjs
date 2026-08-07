#!/usr/bin/env node
/**
 * AI-powered MDX translation script (zh-Hans → en).
 * Uses DeepSeek API to translate Docusaurus docs/blog content.
 *
 * Usage:
 *   node scripts/translate.mjs --base-ref <sha>           # incremental: diff vs base
 *   node scripts/translate.mjs --backfill                 # translate all untranslated files
 *   node scripts/translate.mjs --dry-run                  # preview only, no API calls
 *   node scripts/translate.mjs --file docs/foo.mdx        # translate a single file
 *
 * Env vars:
 *   DEEPSEEK_API_KEY  (required unless --dry-run)
 *   DEEPSEEK_BASE_URL (default: https://api.deepseek.com/v1)
 *   DEEPSEEK_MODEL    (default: deepseek-chat)
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, rmSync, renameSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { parseArgs } from 'node:util';

// ─── CLI argument parsing ────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    'base-ref':   { type: 'string' },
    'backfill':   { type: 'boolean', default: false },
    'dry-run':    { type: 'boolean', default: false },
    'file':       { type: 'string' },
    'out':        { type: 'string' },
    'workers':    { type: 'string', default: '4' },
    'base-url':   { type: 'string' },
    'model':      { type: 'string' },
  },
});

const DEEPSEEK_KEY  = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL  = args['base-url'] || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_MODEL = args['model'] || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const WORKERS       = parseInt(args['workers'], 10) || 4;
const DRY_RUN       = args['dry-run'];

if (!DRY_RUN && !DEEPSEEK_KEY) {
  console.error('Error: DEEPSEEK_API_KEY environment variable is required (or use --dry-run).');
  process.exit(1);
}

// ─── Path mapping ────────────────────────────────────────────────────────────

/**
 * Map a source path to its English translation target.
 * docs/<subpath>.mdx → i18n/en/docusaurus-plugin-content-docs/current/<subpath>.mdx
 * blog/<filename>.mdx → i18n/en/docusaurus-plugin-content-blog/<filename>.mdx
 * blog/tags.yml        → i18n/en/docusaurus-plugin-content-blog/tags.yml
 */
function mapSourceToTarget(srcPath) {
  // Normalize: strip leading ./
  const p = srcPath.replace(/^\.\//, '');
  if (p.startsWith('docs/') && (p.endsWith('.mdx') || p.endsWith('.md'))) {
    const rel = p.slice('docs/'.length);
    return `i18n/en/docusaurus-plugin-content-docs/current/${rel}`;
  }
  if (p.startsWith('blog/') && (p.endsWith('.mdx') || p.endsWith('.md'))) {
    const filename = basename(p);
    return `i18n/en/docusaurus-plugin-content-blog/${filename}`;
  }
  if (p === 'blog/tags.yml') {
    return 'i18n/en/docusaurus-plugin-content-blog/tags.yml';
  }
  return null;
}

// ─── Git helpers ─────────────────────────────────────────────────────────────

function git(args, opts = {}) {
  const cmd = `git ${args}`;
  try {
    return execSync(cmd, { encoding: 'utf-8', ...opts }).trim();
  } catch (e) {
    if (opts.ignoreError) return '';
    throw e;
  }
}

/**
 * Determine which files changed relative to baseRef.
 * Returns array of { status: 'A'|'M'|'D'|'R', path: string }.
 */
function getChangedFiles(baseRef) {
  // -z outputs NUL-delimited: status<NUL>path<NUL> (or R<score><NUL>old<NUL>new<NUL>)
  const out = git(`diff --name-status -z --diff-filter=ADMR ${baseRef} HEAD -- docs/ blog/`);
  if (!out) return [];
  const entries = out.split('\0').filter(Boolean);
  const files = [];
  for (let i = 0; i < entries.length; i++) {
    const statusField = entries[i];
    const status = statusField[0];
    if (status === 'R') {
      files.push({ status: 'D', path: entries[++i] });
      files.push({ status: 'A', path: entries[++i] });
    } else {
      files.push({ status, path: entries[++i] });
    }
  }
  return files;
}

/**
 * Get all source files missing an English translation.
 */
function getUntranslatedFiles() {
  const sources = git('ls-files -- docs/ blog/', { ignoreError: true })
    .split('\n').filter(Boolean);
  return sources.filter(src => {
    const target = mapSourceToTarget(src);
    return target && !existsSync(target);
  });
}

// ─── MDX content protection ──────────────────────────────────────────────────

/**
 * Replace protected content with placeholders, returning { text, placeholders }.
 * Protected: code fences, inline code, JSX/HTML tags, import/export lines,
 * admonition markers, link URLs, image syntax.
 */
function protectContent(content) {
  const placeholders = [];
  let counter = 0;

  const ph = () => {
    const id = `__PH${counter++}__`;
    placeholders.push({ id, value: '' }); // placeholder, will be filled
    return id;
  };

  // We work in stages to avoid nested matches.

  // Stage 1: Protect fenced code blocks
  let text = content.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return `\n${id}\n`;
  });

  // Stage 2: Protect inline code
  text = text.replace(/`([^`]+)`/g, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  // Stage 3: Protect self-closing JSX/HTML tags
  text = text.replace(/<(\w+)(?:\s[^>]*)?\s*\/>/g, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  // Stage 4: Protect import/export lines
  text = text.replace(/^(import\s|export\s).+$/gm, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  // Stage 5: Protect admonition markers (:::note, :::warning, :::tip, etc.)
  // Opening/closing ::: or :::: lines
  text = text.replace(/^:{3,4}\s*\w*.*$/gm, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  // Stage 6: Protect markdown link/image URLs (but not link text)
  text = text.replace(/(\]\([^)]+\))/g, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  // Stage 7: Protect markdown image syntax
  text = text.replace(/(!\[[^\]]*\])/g, (match) => {
    const id = ph();
    const idx = placeholders.findIndex(p => p.id === id);
    placeholders[idx].value = match;
    return id;
  });

  return { text, placeholders };
}

/**
 * Restore protected content from placeholders.
 */
function restoreContent(text, placeholders) {
  let result = text;
  for (const { id, value } of placeholders) {
    // Placeholder may have whitespace around it from the protection stage
    result = result.replace(new RegExp(`\\s*${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), () => value);
  }
  return result;
}

/**
 * Extract frontmatter (leading --- block) from MDX content.
 * Returns { frontmatter, body } or { frontmatter: null, body: content }.
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: null, body: content };
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  };
}

/**
 * Translate frontmatter: only translate title, description, sidebar_label values.
 * Preserves all formatting.
 */
function translateFrontmatter(frontmatter) {
  if (!frontmatter) return frontmatter;
  const translatableKeys = ['title', 'description', 'sidebar_label'];
  const lines = frontmatter.split('\n');
  const result = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)(\w+)\s*:\s*(.+)$/);
    if (m && translatableKeys.includes(m[2])) {
      // Keep the original for now — the main translation call will handle
      // frontmatter text as part of the whole document if we can't do it inline.
      // For simplicity, we mark it for the AI to translate in context.
      result.push(line);
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

// ─── DeepSeek API client ─────────────────────────────────────────────────────

/**
 * Call DeepSeek chat completions API.
 * Returns the model's response text.
 */
async function callDeepSeekAPI(systemPrompt, userContent, retries = 3) {
  const body = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: 0.2,
    max_tokens: 8192,
    response_format: { type: 'json_object' },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(`${DEEPSEEK_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (resp.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
        console.warn(`  Rate limited (429), retrying in ${Math.round(delay / 1000)}s... (attempt ${attempt}/${retries})`);
        await sleep(delay);
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`DeepSeek API error ${resp.status}: ${errText.slice(0, 500)}`);
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(`DeepSeek returned empty response: ${JSON.stringify(data).slice(0, 500)}`);
      }

      if (data.choices?.[0]?.finish_reason === 'length') {
        // Truncated — retry
        console.warn('  Response truncated (length), retrying...');
        body.max_tokens = Math.min(body.max_tokens * 2, 16384);
        continue;
      }

      // Parse JSON from response (strip possible markdown fences)
      const cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
      try {
        return JSON.parse(cleaned);
      } catch {
        // If it's not valid JSON, return as raw object for caller to handle
        return { _raw: content };
      }
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
      console.warn(`  API call failed: ${err.message.slice(0, 100)}. Retrying in ${Math.round(delay / 1000)}s...`);
      await sleep(delay);
    }
  }
}

/** Convenience wrapper for callDeepSeekAPI — extracts 'translation' field. */
async function callDeepSeek(systemPrompt, userContent, retries = 3) {
  const data = await callDeepSeekAPI(systemPrompt, userContent, retries);
  return data?.translation || data?.content || JSON.stringify(data);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Translation logic ───────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a professional technical translator specializing in embedded systems documentation.
Translate Simplified Chinese (zh-Hans) to fluent, natural English.

CRITICAL RULES — follow exactly:
1. Translate ONLY natural-language text. NEVER alter PLACEHOLDER tokens (they look like __PH0__, __PH1__, etc.).
2. NEVER alter, translate, or modify anything inside placeholder tokens — they are replaced after translation.
3. Keep technical terms consistent: LVGL, JerryScript, SNI, control block, lifecycle, object semantics, TLSF, etc.
4. Preserve ALL markdown formatting: headings (#), bold (**), italic (*), lists (-/*), tables (|), blockquotes (>).
5. Preserve ALL HTML entities like &lt; &gt; &amp; &quot; — do NOT decode them.
6. Keep numbers, dates, file paths, URLs, and identifiers exactly as-is.
7. Use natural, idiomatic English appropriate for technical documentation.
8. Output ONLY a JSON object: {"translation": "your translated text here"}`;

const RETRY_PROMPT = `The following text STILL contains Chinese characters that were not translated.
Translate ALL remaining Chinese text to English. Leave everything else unchanged.
Output ONLY a JSON object: {"translation": "fully translated text"}`;

const COMMENT_PROMPT = `Translate these code comments from Simplified Chinese to English.
Keep them concise — code comments should be short and clear.
Preserve any code symbols, variable names, or technical terms as-is.
Return ONLY a JSON object: {"translations": ["comment 1", "comment 2", ...]}`;

const DIFF_UPDATE_PROMPT = `You are a professional technical translator. Below is:
1. The EXISTING English translation of a documentation file
2. A git diff showing what CHANGED in the Chinese source

Update the English translation to reflect ONLY the changes shown in the diff.
- Preserve every English section that corresponds to UNCHANGED Chinese content verbatim.
- Only modify parts that correspond to CHANGED Chinese content.
- Keep ALL formatting, code blocks, placeholders, and structure identical to the existing English — only update the translated prose.

Output ONLY a JSON object: {"translation": "the complete updated English file"}

=== EXISTING ENGLISH ===
{existing}

=== CHINESE DIFF ===
{diff}`;

// ─── Code comment extraction & translation ────────────────────────────────────

function extractComments(content) {
  const commentMap = [];
  let counter = 0;
  const modified = content.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, (block) => {
    const lines = block.split('\n');
    let changed = false;
    const newLines = lines.map((line, i) => {
      if (i === 0 || i === lines.length - 1) return line;
      const trimmed = line.trimStart();
      const indent = line.slice(0, line.length - trimmed.length);
      const cmt = trimmed.match(/^(\/\/|#)\s*(.+)$/);
      if (cmt && /[一-鿿]/.test(cmt[2])) {
        const marker = `__CMT${counter}__`;
        commentMap.push({ marker, original: cmt[2], prefix: cmt[1], indent });
        counter++;
        changed = true;
        return `${indent}${cmt[1]} ${marker}`;
      }
      return line;
    });
    return changed ? newLines.join('\n') : block;
  });
  return { modified, commentMap };
}

async function translateCommentBatch(commentMap) {
  if (commentMap.length === 0) return [];
  const lines = commentMap.map((c, i) => `[${i}] ${c.original}`).join('\n');
  if (DRY_RUN) {
    console.log(`    → would translate ${commentMap.length} code comment(s)`);
    return commentMap.map(c => c.original);
  }
  try {
    const data = await callDeepSeekAPI(COMMENT_PROMPT, lines);
    const translations = data.translations || [];
    console.log(`    → translated ${translations.length}/${commentMap.length} code comment(s)`);
    return translations;
  } catch (err) {
    console.warn(`    → comment translation failed: ${err.message}, keeping originals`);
    return commentMap.map(c => c.original);
  }
}

function restoreComments(content, commentMap, translations) {
  let result = content;
  for (let i = 0; i < commentMap.length; i++) {
    const { marker } = commentMap[i];
    const translated = translations[i] || commentMap[i].original;
    result = result.replaceAll(marker, translated);
  }
  return result;
}

/**
 * Full translation of a new file.
 */
async function translateFull(sourcePath) {
  const source = readFileSync(sourcePath, 'utf-8');

  // Quick check: skip if no CJK characters (already English or code-only)
  if (!/[一-鿿㐀-䶿]/.test(source)) {
    return { action: 'skip', reason: 'no Chinese characters detected' };
  }

  // Step 1: Extract code comments for separate translation
  const { modified: sourceWithMarkers, commentMap } = extractComments(source);

  // Step 2: Protect code blocks, inline code, JSX, etc.
  const { frontmatter, body } = extractFrontmatter(sourceWithMarkers);
  const { text: protectedBody, placeholders } = protectContent(body);

  const userContent = frontmatter
    ? `---\n${frontmatter}\n---\n\n${protectedBody}`
    : protectedBody;

  if (DRY_RUN) {
    return { action: 'full', targetPath: mapSourceToTarget(sourcePath), dryRun: true };
  }

  // Step 3: Translate the main document body
  let translated = await callDeepSeek(SYSTEM_PROMPT, userContent);
  let restored = restoreContent(translated, placeholders);

  // Step 4: Self-correction — if Chinese characters remain, retry once
  if (/[一-鿿]/.test(restored.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, ''))) {
    console.log('  → Chinese characters remaining, retrying with correction prompt...');
    const retryTranslated = await callDeepSeek(RETRY_PROMPT, restored);
    restored = restoreContent(retryTranslated, placeholders);
  }

  // Step 5: Translate code comments
  if (commentMap.length > 0) {
    const commentTranslations = await translateCommentBatch(commentMap);
    restored = restoreComments(restored, commentMap, commentTranslations);
  }

  return { action: 'full', targetPath: mapSourceToTarget(sourcePath), content: restored };
}

/**
 * Update translation for a modified file using diff.
 */
async function translateDiff(sourcePath) {
  const targetPath = mapSourceToTarget(sourcePath);
  if (!targetPath || !existsSync(targetPath)) {
    // No existing translation — do full translation
    return translateFull(sourcePath);
  }

  const source = readFileSync(sourcePath, 'utf-8');
  if (!/[一-鿿㐀-䶿]/.test(source)) {
    return { action: 'skip', reason: 'no Chinese characters detected' };
  }

  const existingEn = readFileSync(targetPath, 'utf-8');

  // Get the diff for this specific file
  const diff = git(`diff origin/main...HEAD -- "${sourcePath}"`, { ignoreError: true });
  if (!diff || diff.trim().length === 0) {
    return { action: 'skip', reason: 'no diff available' };
  }

  if (DRY_RUN) {
    return { action: 'diff', targetPath, dryRun: true, diffSize: diff.length };
  }

  // For diff-based translation, we send the existing English + the diff
  // and ask the AI to update only the changed parts.
  const prompt = DIFF_UPDATE_PROMPT
    .replace('{existing}', existingEn)
    .replace('{diff}', diff);

  const translated = await callDeepSeek(SYSTEM_PROMPT, prompt);
  return { action: 'diff', targetPath, content: translated };
}

/**
 * Handle deleted source file — remove English counterpart.
 */
function handleDelete(sourcePath) {
  const targetPath = mapSourceToTarget(sourcePath);
  if (!targetPath) return { action: 'skip', reason: 'no target mapping' };

  if (DRY_RUN) {
    return { action: 'delete', targetPath, dryRun: true };
  }

  if (existsSync(targetPath)) {
    unlinkSync(targetPath);
    // Prune empty parent directories
    let dir = dirname(targetPath);
    while (dir !== '.' && dir !== 'i18n/en') {
      try {
        const files = execSync(`ls -A "${dir}"`, { encoding: 'utf-8' }).trim();
        if (!files) rmSync(dir);
        else break;
      } catch { break; }
      dir = dirname(dir);
    }
    return { action: 'delete', targetPath };
  }
  return { action: 'skip', reason: 'target does not exist' };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function processFile(file) {
  const { status, path } = file;
  const targetPath = mapSourceToTarget(path);

  if (!targetPath) {
    return { path, action: 'skip', reason: 'not a translatable file' };
  }

  console.log(`[${status}] ${path} → ${targetPath}`);

  try {
    switch (status) {
      case 'A':
        return { path, ...(await translateFull(path)) };
      case 'M':
        return { path, ...(await translateDiff(path)) };
      case 'D':
        return { path, ...handleDelete(path) };
      case 'R':
        // Handled as separate D + A entries
        return { path, action: 'skip', reason: 'rename handled as D+A' };
      default:
        return { path, action: 'skip', reason: `unknown status: ${status}` };
    }
  } catch (err) {
    console.error(`  Error processing ${path}: ${err.message}`);
    return { path, action: 'failed', error: err.message };
  }
}

/**
 * Write translated content to disk.
 */
function writeTranslation(targetPath, content) {
  const dir = dirname(targetPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  // Atomic write: write to tmp then rename
  const tmpPath = targetPath + '.tmp';
  writeFileSync(tmpPath, content, 'utf-8');
  execSync(`mv "${tmpPath}" "${targetPath}"`);
}

async function main() {
  let files;

  if (args['file']) {
    // Single file mode
    files = [{ status: existsSync(mapSourceToTarget(args['file'])) ? 'M' : 'A', path: args['file'] }];
  } else if (args['backfill']) {
    // Backfill mode: all source files missing English translations
    const untranslated = getUntranslatedFiles();
    files = untranslated.map(p => ({ status: 'A', path: p }));
    console.log(`Backfill mode: ${files.length} untranslated files found.`);
  } else {
    // Incremental mode: diff against base ref
    let baseRef = args['base-ref'];
    if (!baseRef) {
      // Auto-detect: try github.event.before, then origin/main
      baseRef = git('rev-parse origin/main 2>/dev/null || echo ""', { ignoreError: true });
    }
    if (!baseRef) {
      console.error('Error: could not determine base ref. Use --base-ref or ensure origin/main exists.');
      process.exit(1);
    }
    // Verify the ref is valid
    const valid = git(`cat-file -t ${baseRef} 2>/dev/null || echo "invalid"`, { ignoreError: true });
    if (valid === 'invalid' || valid === '') {
      // Probably the first push of a branch — use origin/main
      baseRef = 'origin/main';
    }
    console.log(`Base ref: ${baseRef}`);
    files = getChangedFiles(baseRef);
  }

  if (files.length === 0) {
    console.log('No files to translate.');
    const summary = { translated: [], deleted: [], skipped: [], failed: [] };
    if (args['out']) writeFileSync(args['out'], JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`Found ${files.length} file(s) to process.`);
  if (DRY_RUN) console.log('[DRY RUN] No API calls will be made.\n');

  // Process files with limited concurrency
  const results = [];
  const queue = [...files];

  async function worker() {
    while (queue.length > 0) {
      const file = queue.shift();
      if (!file) break;
      const result = await processFile(file);
      results.push(result);

      // Write translation to disk immediately
      if (result.content && result.targetPath && !DRY_RUN) {
        writeTranslation(result.targetPath, result.content);
        console.log(`  ✓ wrote ${result.targetPath}`);
      }
    }
  }

  // Start worker pool
  const workers = Array.from({ length: Math.min(WORKERS, files.length) }, () => worker());
  await Promise.all(workers);

  // Summary
  const summary = {
    translated: results.filter(r => r.action === 'full' || r.action === 'diff'),
    deleted:    results.filter(r => r.action === 'delete'),
    skipped:    results.filter(r => r.action === 'skip'),
    failed:     results.filter(r => r.action === 'failed'),
  };

  console.log(`\n─ Summary ─────────────────────────────────`);
  console.log(`  Translated: ${summary.translated.length}`);
  console.log(`  Deleted:    ${summary.deleted.length}`);
  console.log(`  Skipped:    ${summary.skipped.length}`);
  console.log(`  Failed:     ${summary.failed.length}`);

  if (summary.failed.length > 0) {
    console.log('\n  Failed files:');
    for (const f of summary.failed) {
      console.log(`    - ${f.path}: ${f.error}`);
    }
  }

  if (summary.skipped.length > 0) {
    console.log('\n  Skipped files:');
    for (const f of summary.skipped) {
      console.log(`    - ${f.path}: ${f.reason || 'no action needed'}`);
    }
  }

  // Write summary JSON if requested
  if (args['out']) {
    writeFileSync(args['out'], JSON.stringify(summary, null, 2));
  }

  // Exit with error if any failures
  if (summary.failed.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
