// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'introduction',
    'getting_started/quick_start',
    {
      type: 'category',
      label: '系统架构',
      items: [
        'architecture/arch',
        {
          type: 'category',
          label: '核心概念与运行模型',
          items: [
            'architecture/application_contract',
            'architecture/framework/app/app',
            'architecture/runtime',
            'architecture/framework/activity/activity',
            'architecture/framework/app/recent_apps',
            'architecture/framework/watchface/watchface',
            'architecture/script_engine_overview',
            'architecture/script_engine/index',
            'architecture/script_engine/sni/sni',
          ],
        },
        {
          type: 'category',
          label: '系统服务',
          items: [
            'architecture/services/pm/pm',
            'architecture/services/display/display',
            'architecture/services/sensor/sensor',
            'architecture/services/battery/battery',
            'architecture/services/storage/storage',
            'architecture/services/config/config',
            'architecture/services/state/state',
            'architecture/services/time/time',
            'architecture/services/audio/audio',
            'architecture/services/haptic/haptic',
            'architecture/services/log/log',
            'architecture/services/metric/metric',
          ],
        },
        {
          type: 'category',
          label: 'UI 架构',
          items: [
            'architecture/ui/ui',
            'architecture/ui/widgets/card_pager/card_pager',
            'architecture/ui/widgets/slide_widget/slide_widget',
            'architecture/ui/widgets/swipe_panel/swipe_panel',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Application 开发',
      items: ['getting_started/application_development'],
    },
    {
      type: 'category',
      label: 'Watch Face 开发',
      items: ['getting_started/watchface_development'],
    },
    {
      type: 'category',
      label: 'Platform / Board 开发',
      items: [
        'integration/overview',
        'getting_started/build',
        'integration/psoc_edge_e84_build',
        'architecture/platform_contract',
        'architecture/device_architecture_design',
        'architecture/hardware',
        'architecture/driver',
      ],
    },
    {
      type: 'category',
      label: 'Core 开发',
      items: [
        'architecture/core_development_contract',
        'development/kconfig',
        {
          type: 'category',
          label: '测试',
          items: [
            'development/testing/overview',
            'development/testing/writing_tests',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '按需使用的开发工具',
      items: ['development/toolkit'],
    },
    {
      type: 'category',
      label: 'API 与格式参考',
      items: [
        'architecture/package_format',
        {
          type: 'category',
          label: 'JavaScript API 参考',
          items: [
            'architecture/script_engine/elenix_os',
            'architecture/script_engine/lvgl',
            'architecture/script_engine/special',
            {
              type: 'category',
              label: '特殊组件 API',
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
      label: '模拟器（辅助环境）',
      items: [
        'simulator/overview',
        'getting_started/environment',
        'simulator/build',
        'simulator/native',
        'simulator/wasm',
        'development/dev_tools',
        'getting_started/faq',
      ],
    },
    'contributing',
    'CHANGELOG',
  ],
};

export default sidebars;
