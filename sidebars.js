// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 *
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    'introduction',
    {
      type: 'category',
      label: '入门',
      items: [
        'getting_started/quick_start',
        'getting_started/build',
        'getting_started/environment',
        'getting_started/faq',
      ],
    },
    {
      type: 'category',
      label: '模拟器',
      items: [
        'simulator/overview',
        'simulator/native',
        'simulator/wasm',
      ],
    },
    {
      type: 'category',
      label: '集成指南',
      items: [
        'integration/overview',
      ],
    },
    {
      type: 'category',
      label: '系统架构',
      items: [
        'architecture/arch',
        'architecture/runtime',
        'architecture/device_architecture_design',
        {
          type: 'category',
          label: '框架层',
          items: [
            'architecture/framework/app/app',
            'architecture/framework/activity/activity',
          ],
        },
        {
          type: 'category',
          label: '内核层',
          items: [
            'architecture/kernel/event/events',
            'architecture/kernel/scheduler/dispatcher',
          ],
        },
        {
          type: 'category',
          label: '服务层',
          items: [
            'architecture/services/storage/storage',
            'architecture/services/battery/battery',
            'architecture/services/config/config',
            'architecture/services/display/display',
            'architecture/services/haptic/haptic',
            'architecture/services/log/log',
            'architecture/services/pm/pm',
            'architecture/services/sensor/sensor',
            'architecture/services/state/state',
            'architecture/services/time/time',
            'architecture/services/audio/audio',
          ],
        },
        {
          type: 'category',
          label: 'UI层',
          items: [
            'architecture/ui/ui',
            'architecture/ui/widgets/card_pager/card_pager',
            'architecture/ui/widgets/slide_widget/slide_widget',
            'architecture/ui/widgets/swipe_panel/swipe_panel',
          ],
        },
        {
          type: 'category',
          label: '脚本引擎',
          items: [
            'architecture/script_engine_overview',
            'architecture/script_engine/elenix_os',
            'architecture/script_engine/lvgl',
            'architecture/script_engine/special',
            'architecture/script_engine/sni/sni',
            {
              type: 'category',
              label: '特殊组件',
              items: [
                'architecture/script_engine/sni/sni_api/lv/special/anim',
                'architecture/script_engine/sni/sni_api/lv/special/btnm',
                'architecture/script_engine/sni/sni_api/lv/special/calendar',
                'architecture/script_engine/sni/sni_api/lv/special/canvas',
                'architecture/script_engine/sni/sni_api/lv/special/dropdown',
                'architecture/script_engine/sni/sni_api/lv/special/image',
                'architecture/script_engine/sni/sni_api/lv/special/obj',
                'architecture/script_engine/sni/sni_api/lv/special/timer',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '开发指南',
      items: [
        'development/dev_tools',
        'development/package_builder',
      ],
    },
    'contributing',
    'CHANGELOG',
  ],
};

export default sidebars;
