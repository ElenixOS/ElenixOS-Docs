// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ElenixOS docs',
  tagline: 'Documentation for ElenixOS',
  favicon: 'img/favicon.ico',

  markdown: {
    mermaid: true,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://elenixos.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ElenixOS', // Usually your GitHub org/user name.
  projectName: 'ElenixOS-docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ElenixOS/ElenixOS-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ElenixOS/ElenixOS-docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // Index both docs and blog content for local search.
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        language: ['zh', 'en'],
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'forest'},
      },
      navbar: {
        logo: {
          alt: 'ElenixOS Logo',
          src: 'img/logo.png',
          srcDark: 'img/logo_dark.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            href: 'https://simulator.elenixos.com/wasm/latest/main.html',
            label: '在线模拟器',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value: `
              <a href="https://github.com/ElenixOS/ElenixOS"
                 class="navbar__link navbar-github-link"
                 target="_blank" rel="noopener noreferrer"
                 aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            `,
          },
        ],
      },
      footer: {
        links: [
          {
            title: '浏览文档',
            items: [
              {label: '项目介绍', to: '/docs/intro'},
              {label: '快速开始', to: '/docs/getting_started/quick_start'},
              {label: '构建与使用', to: '/docs/getting_started/build'},
              {label: '系统架构', to: '/docs/architecture/arch'},
              {label: '更新日志', to: '/docs/CHANGELOG'},
            ],
          },
          {
            title: '项目资源',
            items: [
              {label: '脚本引擎指南', to: '/docs/architecture/script_engine'},
              {label: 'JavaScript API', to: '/docs/architecture/script_engine/elenix_os'},
              {label: '开发工具', to: '/docs/development/dev_tools'},
              {label: '在线模拟器', href: 'https://simulator.elenixos.com/wasm/latest/main.html'},
            ],
          },
          {
            title: '开发者社区',
            items: [
              {label: 'GitHub Discussions', href: 'https://github.com/ElenixOS/ElenixOS/discussions'},
              {label: '腾讯频道', href: 'https://pd.qq.com/s/2arlf3js7'},
              {label: '博客', to: '/blog'},
              {label: '联系我们', href: 'mailto:contact@elenixos.com'},
            ],
          },
        ],
        copyright: `Copyright \u00A9 ${new Date().getFullYear()} ElenixOS. Built with <a href="https://docusaurus.io" target="_blank" rel="noopener noreferrer">Docusaurus</a>.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
