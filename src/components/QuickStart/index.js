import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const STEPS = [
  {
    number: '01',
    title: translate({id: 'homepage.quick.step1.title', message: '在线体验'}),
    items: [
      translate({id: 'homepage.quick.step1.a', message: '浏览器直接打开模拟器'}),
      translate({id: 'homepage.quick.step1.b', message: '无需安装，即刻上手'}),
      translate({id: 'homepage.quick.step1.c', message: '体验完整系统功能'}),
    ],
    cta: translate({id: 'homepage.quick.step1.cta', message: '打开模拟器'}),
    url: 'https://simulator.elenixos.com/wasm/latest/main.html',
    external: true,
  },
  {
    number: '02',
    title: translate({id: 'homepage.quick.step2.title', message: '环境搭建'}),
    items: [
      translate({id: 'homepage.quick.step2.a', message: '克隆代码仓库'}),
      translate({id: 'homepage.quick.step2.b', message: '安装编译依赖'}),
      translate({id: 'homepage.quick.step2.c', message: '编译运行 PC 模拟器'}),
    ],
    cta: translate({id: 'homepage.quick.step2.cta', message: '查看构建指南'}),
    url: '/docs/getting_started/build',
  },
  {
    number: '03',
    title: translate({id: 'homepage.quick.step3.title', message: '开发应用'}),
    items: [
      translate({id: 'homepage.quick.step3.a', message: '阅读 JS API 文档'}),
      translate({id: 'homepage.quick.step3.b', message: '编写 UI 与交互逻辑'}),
      translate({id: 'homepage.quick.step3.c', message: '打包并部署到设备'}),
    ],
    cta: translate({id: 'homepage.quick.step3.cta', message: '查看 JS API'}),
    url: '/docs/architecture/script_engine/elenix_os',
  },
];

function StepCard({number, title, items, cta, url, external, index, total}) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>{number}</span>
        <Heading as="h3" className={styles.stepTitle}>{title}</Heading>
      </div>
      <ul className={styles.stepList}>
        {items.map((item, i) => (
          <li key={i} className={styles.stepItem}>{item}</li>
        ))}
      </ul>
      <Link
        className={styles.stepCta}
        to={url}
        {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      >
        {cta}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
        </svg>
      </Link>
    </div>
  );
}

export default function QuickStart() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.headerBlock}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="homepage.quick.heading">三步开始</Translate>
          </Heading>
        </div>
        <div className={styles.grid}>
          {STEPS.map((step, i) => (
            <StepCard key={i} {...step} index={i} total={STEPS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
