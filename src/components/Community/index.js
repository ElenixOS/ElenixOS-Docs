import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const COMMUNITY_LINKS = [
  {
    label: 'GitHub',
    desc: translate({id: 'homepage.community.github.desc', message: '源代码与 Issues'}),
    url: 'https://github.com/ElenixOS/ElenixOS',
  },
  {
    label: 'Discussions',
    desc: translate({id: 'homepage.community.discussions.desc', message: '技术交流与问答'}),
    url: 'https://github.com/ElenixOS/ElenixOS/discussions',
  },
  {
    label: translate({id: 'homepage.community.qq.label', message: '腾讯频道'}),
    desc: translate({id: 'homepage.community.qq.desc', message: '中国开发者社区'}),
    url: 'https://pd.qq.com/s/2arlf3js7',
  },
  {
    label: translate({id: 'homepage.community.simulator.label', message: '在线模拟器'}),
    desc: translate({id: 'homepage.community.simulator.desc', message: '浏览器即刻体验'}),
    url: 'https://simulator.elenixos.com/wasm/latest/main.html',
  },
];

function CommunityCard({label, desc, url}) {
  return (
    <Link to={url} className={styles.card} target="_blank" rel="noopener noreferrer">
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardDesc}>{desc}</span>
    </Link>
  );
}

export default function Community() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.headerBlock}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="homepage.community.heading">加入社区，共同构建</Translate>
          </Heading>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.community.subtitle">ElenixOS 是一个开放的社区驱动项目，欢迎每一位开发者的参与和贡献。</Translate>
          </p>
        </div>
        <div className={styles.grid}>
          {COMMUNITY_LINKS.map((link, i) => (
            <CommunityCard key={i} {...link} />
          ))}
        </div>
        <div className={styles.license}>
          <span className={styles.licenseIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/>
            </svg>
          </span>
          <Translate id="homepage.community.license">
            Apache License 2.0 — 自由使用、修改与分发，可用于商业用途。
          </Translate>
        </div>
      </div>
    </section>
  );
}
