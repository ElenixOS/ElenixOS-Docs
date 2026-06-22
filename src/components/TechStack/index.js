import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function TechStack() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.tech.heading">技术栈</Translate>
        </Heading>

        <div className={styles.coreRow}>
          <div className={styles.coreBlock}>
            <span className={styles.coreName}>LVGL</span>
            <span className={styles.coreDesc}>
              <Translate id="homepage.tech.lvgl.desc">轻量级嵌入式图形库，提供丰富的 UI 控件与动画能力，驱动全部界面渲染。</Translate>
            </span>
          </div>
          <span className={styles.coreSeparator}></span>
          <div className={styles.coreBlock}>
            <span className={styles.coreName}>JerryScript</span>
            <span className={styles.coreDesc}>
              <Translate id="homepage.tech.jerry.desc">专为 IoT 与嵌入式设备设计的 JavaScript 引擎，在极小内存占用下提供完整的 ES5.1 执行环境。</Translate>
            </span>
          </div>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText}>
            <Translate id="homepage.tech.runtimeTitle">ElenixOS 自研运行时</Translate>
          </span>
        </div>

        <div className={styles.runtimeFlow}>
          <div className={styles.flowItem}>
            <span className={styles.flowLabel}>SPM</span>
            <span className={styles.flowDesc}>
              <Translate id="homepage.tech.spm">生命周期管理</Translate>
            </span>
          </div>
          <svg className={styles.flowArrow} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
          <div className={styles.flowItem}>
            <span className={styles.flowLabel}>SNI</span>
            <span className={styles.flowDesc}>
              <Translate id="homepage.tech.sni">API 桥接层</Translate>
            </span>
          </div>
          <svg className={styles.flowArrow} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
          <div className={styles.flowItem}>
            <span className={styles.flowLabel}>
              <Translate id="homepage.tech.native">原生服务</Translate>
            </span>
            <span className={styles.flowDesc}>
              <Translate id="homepage.tech.nativeCount">10+ 系统服务</Translate>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
