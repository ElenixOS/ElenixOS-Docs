import clsx from 'clsx';
import {useEffect, useState, useRef} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ArchitectureOverview from '@site/src/components/ArchitectureOverview';
import WhyChoose from '@site/src/components/WhyChoose';
import TechStack from '@site/src/components/TechStack';
import QuickStart from '@site/src/components/QuickStart';
import Community from '@site/src/components/Community';
import BottomCTA from '@site/src/components/BottomCTA';

import Heading from '@theme/Heading';
import {Highlight, themes} from 'prism-react-renderer';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './index.module.css';

const SIMULATOR_URL = 'https://simulator.elenixos.com/wasm/latest/main.html';
const DEMO_APP_ID = 'com.elenixos.demo';
const SEND_TIMEOUT_MS = 3000;
const SEND_MAX_RETRIES = 3;
const SEND_RETRY_DELAY_MS = 500;

// Module-level message listener: survives Docusaurus SPA component remounts
// (e.g. language switching) so messages from the iframe are never lost.
let _globalListenerActive = false;
const _stateBinding = {current: null};

function _ensureGlobalListener() {
  if (_globalListenerActive) return;
  _globalListenerActive = true;
  window.addEventListener('message', (event) => {
    const message = event.data;
    const bound = _stateBinding.current;
    if (!bound || !message || message.namespace !== 'ElenixOS') return;
    if (message.type === 'ready') {
      bound.setIsReady(true);
    } else if (message.type === 'response') {
      if (message.action === 'readAppMainJs' && message.ok) {
        bound.setDemoCode(message.result || bound.defaultCode);
        bound.setCanWrite(true);
      } else if (message.action === 'readAppMainJs' && !message.ok) {
        bound.setDemoCode(bound.defaultCode);
        bound.setCanWrite(false);
      }
    }
  });
}

function HomepageHeader() {
  const [isReady, setIsReady] = useState(false);
  const [commandId, setCommandId] = useState(1);
  const [demoCode, setDemoCode] = useState('');
  const [canWrite, setCanWrite] = useState(false);
  const [listenerReady, setListenerReady] = useState(false);
  const iframeRef = useRef(null);
  const codeHighlighterRef = useRef(null);
  const {colorMode} = useColorMode();
  const prismTheme = colorMode === 'dark' ? themes.dracula : themes.github;

  const handleEditorScroll = (e) => {
    if (codeHighlighterRef.current) {
      codeHighlighterRef.current.scrollTop = e.target.scrollTop;
      codeHighlighterRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const defaultCode = translate({
    id: 'homepage.codeCard.snippet',
    message: `// \u83b7\u53d6\u5f53\u524d\u6d3b\u52a8 View
const view = eos.view.active();

// \u521b\u5efa\u4e00\u4e2a\u6309\u94ae
const button = new lv.button(view);
button.setSize(180, 64);
button.align(lv.ALIGN_CENTER, 0, 20);

// \u6dfb\u52a0\u6807\u7b7e
const label = new lv.label(button);
label.setText('Click Me');
label.center();

// \u7ed1\u5b9a\u70b9\u51fb\u4e8b\u4ef6
button.addEventCb((e) => {
  eos.console.log('Button clicked!');
  label.setText('Clicked!');
}, lv.EVENT_CLICKED, null);`,
  });

  useEffect(() => {
    _ensureGlobalListener();
    _stateBinding.current = {setIsReady, setDemoCode, setCanWrite, defaultCode};
    setListenerReady(true);
    return () => { _stateBinding.current = null; };
  }, []);

  useEffect(() => {
    if (isReady) readDemoCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const sendCommand = (action, payload = {}, callback = null) => {
    const attempt = (retriesLeft) => {
      if (!iframeRef.current || !isReady) {
        if (retriesLeft > 0) {
          setTimeout(() => attempt(retriesLeft - 1), SEND_RETRY_DELAY_MS);
        }
        return;
      }
      const id = commandId;
      setCommandId(id + 1);
      const message = {
        namespace: 'ElenixOS', type: 'command',
        id: id.toString(), action, payload,
      };
      let timeoutId;
      const handleResponse = (event) => {
        const response = event.data;
        if (response && response.namespace === 'ElenixOS' && response.type === 'response') {
          if (response.id === id.toString() || (response.id === '' && response.action === action)) {
            clearTimeout(timeoutId);
            if (callback) callback(response);
            window.removeEventListener('message', handleResponse);
          }
        }
      };
      timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        if (retriesLeft > 0) attempt(retriesLeft - 1);
      }, SEND_TIMEOUT_MS);
      window.addEventListener('message', handleResponse);
      iframeRef.current.contentWindow.postMessage(message, '*');
    };
    attempt(SEND_MAX_RETRIES);
  };

  const readDemoCode = () => {
    sendCommand('readAppMainJs', { appId: DEMO_APP_ID });
  };

  const writeDemoCode = () => {
    sendCommand('writeAppMainJs', { appId: DEMO_APP_ID, code: demoCode }, (response) => {
      if (response.ok) sendCommand('launchAppById', { appId: DEMO_APP_ID });
    });
  };

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <Translate id="homepage.badge">开源智能手表操作系统</Translate>
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          <Translate id="homepage.title">ElenixOS</Translate>
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.subtitle">
            面向智能手表的开源操作系统。基于 LVGL 图形栈与 JerryScript 脚本引擎构建，采用"JS 写 UI + 原生做渲染"的分层运行模型，在资源受限的嵌入式平台上提供流畅、一致的智能穿戴体验。
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link className={clsx('button button--lg', styles.primaryButton)} to="/docs/intro">
            <Translate id="homepage.cta.docs">阅读文档</Translate>
          </Link>
          <Link className={clsx('button button--lg', styles.secondaryButton)} to="https://github.com/ElenixOS/ElenixOS">
            <Translate id="homepage.cta.repo">GitHub 仓库</Translate>
          </Link>
        </div>
        <div className={styles.quickLinks}>
          <Link className={styles.quickLink} to="/docs/getting_started/quick_start">
            <Translate id="homepage.quick.start">快速开始</Translate>
          </Link>
          <span className={styles.quickLinkDivider}>&#183;</span>
          <Link className={styles.quickLink} to="/docs/architecture/script_engine/elenix_os">
            <Translate id="homepage.quick.api">JS API</Translate>
          </Link>
          <span className={styles.quickLinkDivider}>&#183;</span>
          <Link className={styles.quickLink} to="/docs/architecture/arch">
            <Translate id="homepage.quick.arch">架构设计</Translate>
          </Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statItem}><strong>GUI</strong><span>LVGL</span></div>
          <div className={styles.statItem}>
            <strong><Translate id="homepage.stats.engine">脚本引擎</Translate></strong>
            <span>JerryScript</span>
          </div>
          <div className={styles.statItem}>
            <strong><Translate id="homepage.stats.license">许可证</Translate></strong>
            <span>Apache 2.0</span>
          </div>
          <div className={styles.statItem}>
            <strong><Translate id="homepage.stats.simulator">在线体验</Translate></strong>
            <span><Translate id="homepage.stats.simulator.value">模拟器</Translate></span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.demoCard}>
          <div className={styles.demoHeader}>
            <span className={styles.demoDot} />
            <span className={styles.demoDot} />
            <span className={styles.demoDot} />
            <p className={styles.demoTitle}>ElenixOS Online Simulator</p>
            <div className={styles.demoStatus}>
              <span className={clsx(styles.statusDot, isReady ? styles.statusReady : styles.statusNotReady)} />
              <p className={styles.demoStatusText}>
                {isReady ? translate({id: 'homepage.simulator.status.ready', message: '已就绪'}) : translate({id: 'homepage.simulator.status.connecting', message: '连接中...'})}
              </p>
            </div>
          </div>
          <div className={styles.demoBody}>
            <div className={styles.demoEditor}>
              <div className={styles.editorToolbar}>
                <span className={styles.editorLabel}>main.js</span>
                <button
                  className={clsx(styles.runButton, !canWrite && styles.runButtonDisabled)}
                  onClick={writeDemoCode}
                  disabled={!canWrite || !isReady}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <Translate id="homepage.run">运行</Translate>
                </button>
              </div>
              <div className={styles.editorWrapper}>
                <pre ref={codeHighlighterRef} className={styles.codeHighlighter} aria-hidden="true">
                  <Highlight code={demoCode || ''} language="javascript" theme={prismTheme}>
                    {({className, style, tokens, getLineProps, getTokenProps}) => (
                      <code className={className} style={{...style, background: 'none'}}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({line})}>
                            {line.map((token, key) => <span key={key} {...getTokenProps({token})} />)}
                          </div>
                        ))}
                      </code>
                    )}
                  </Highlight>
                </pre>
                <textarea
                  className={styles.codeEditor}
                  value={demoCode}
                  onChange={(e) => setDemoCode(e.target.value)}
                  onScroll={handleEditorScroll}
                  placeholder={translate({id: 'homepage.codeEditor.placeholder', message: '输入你的代码...'})}
                  spellCheck={false}
                />
              </div>
            </div>
            <div className={styles.demoPreview}>
              <iframe ref={iframeRef} src={listenerReady ? SIMULATOR_URL : 'about:blank'} className={styles.previewFrame} title="ElenixOS WASM Simulator" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const baseUrl = siteConfig.baseUrl || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const pathname = window.location.pathname;
    if (pathname !== normalizedBase) return;
    if (window.localStorage.getItem('docusaurus.locale')) return;

    const browserLanguage = (navigator.language || '').toLowerCase();
    const isChinaRegion = /-cn\b/.test(browserLanguage);
    if (!isChinaRegion) {
      const englishLocaleUrl = new URL(window.location.href);
      englishLocaleUrl.port = '3000';
      englishLocaleUrl.pathname = '/en/';
      englishLocaleUrl.search = '';
      englishLocaleUrl.hash = '';
      window.location.replace(englishLocaleUrl.toString());
    }
  }, [siteConfig.baseUrl]);

  return (
    <Layout
      title={`${translate({id: 'homepage.layoutTitle', message: '首页'})} | ${siteConfig.title}`}
      description={translate({id: 'homepage.layoutDescription', message: 'ElenixOS 构建、脚本引擎与开发工具文档站点。'})}>
      <HomepageHeader />
      <main>
        <ArchitectureOverview />
        <WhyChoose />
        <HomepageFeatures />
        <TechStack />
        <QuickStart />
        <Community />
      </main>
      <BottomCTA />
    </Layout>
  );
}
