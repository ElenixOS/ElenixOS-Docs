import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const ADVANTAGES = [
  {
    title: translate({id: 'homepage.why.script.title', message: '脚本化开发，迭代极速'}),
    description: translate({id: 'homepage.why.script.desc', message: '用 JavaScript 编写 UI 与交互逻辑，无需重新编译固件即可热更新。表盘与应用程序共享同一脚本运行时和 API 体系，学习成本低，整体更统一。'}),
    color: '#0071e3',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: translate({id: 'homepage.why.resource.title', message: '资源友好，深度优化'}),
    description: translate({id: 'homepage.why.resource.desc', message: 'JerryScript 专为低内存设备设计，LVGL 渲染高效。系统经过深度优化，可在典型智能手表 MCU 上流畅运行，RAM 占用极低。'}),
    color: '#f56e0f',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: translate({id: 'homepage.why.portable.title', message: '高可移植，一次编写多平台复用'}),
    description: translate({id: 'homepage.why.portable.desc', message: '六层抽象分层与统一设备接口，移植到新 MCU 只需实现驱动层适配，上层应用代码零改动，大幅降低跨平台迁移成本。'}),
    color: '#30d158',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: translate({id: 'homepage.why.ux.title', message: 'Apple Watch 级交互体验'}),
    description: translate({id: 'homepage.why.ux.desc', message: 'UI 与交互风格深度参考 Apple Watch，强调动画连贯性、手势流畅性与界面层级关系。结合 LVGL 动画系统与事件机制，在嵌入式平台上实现接近原生智能手表的体验。'}),
    color: '#8944ab',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function WhyChoose() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.why.heading">为什么选择 ElenixOS</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.why.subtitle">专为可穿戴而生的开放系统，平衡极致性能与开发效率。</Translate>
        </p>
        <div className={styles.list}>
          {ADVANTAGES.map((item, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.rowIcon} style={{color: item.color}}>
                {item.icon}
              </div>
              <div className={styles.rowBody}>
                <Heading as="h3" className={styles.rowTitle}>{item.title}</Heading>
                <p className={styles.rowDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
