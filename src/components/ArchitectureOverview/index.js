import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const LAYERS = [
  {
    label: translate({id: 'homepage.arch.layer6', message: '应用层'}),
    items: [
      translate({id: 'homepage.arch.app.watchface', message: '表盘系统'}),
      translate({id: 'homepage.arch.app.system', message: '系统应用'}),
      translate({id: 'homepage.arch.app.third', message: '第三方应用'}),
    ],
    url: '/docs/architecture/framework/app/app',
  },
  {
    label: translate({id: 'homepage.arch.layer5', message: '内核层'}),
    items: [
      translate({id: 'homepage.arch.kernel.script', message: '脚本引擎 (SPM / SNI)'}),
      translate({id: 'homepage.arch.kernel.event', message: '事件系统'}),
      translate({id: 'homepage.arch.kernel.ui', message: '内置 UI 控件'}),
    ],
    url: '/docs/architecture/runtime',
  },
  {
    label: translate({id: 'homepage.arch.layer4', message: '服务层'}),
    items: [
      translate({id: 'homepage.arch.service.sensor', message: '传感器 · 显示 · 电池 · 存储 · 电源'}),
      translate({id: 'homepage.arch.service.count', message: '10+ 标准系统服务'}),
    ],
    url: '/docs/architecture/services/sensor/sensor',
  },
  {
    label: translate({id: 'homepage.arch.layer3', message: '设备管理器'}),
    items: [
      translate({id: 'homepage.arch.device.unified', message: '统一设备注册与查找'}),
      translate({id: 'homepage.arch.device.state', message: '状态机 · 状态上报'}),
    ],
    url: '/docs/architecture/device_architecture_design',
  },
  {
    label: translate({id: 'homepage.arch.layer2', message: '驱动层'}),
    items: [
      translate({id: 'homepage.arch.driver.sensor', message: '传感器驱动 · 显示驱动'}),
      translate({id: 'homepage.arch.driver.fs', message: '电池驱动 · 文件系统驱动'}),
    ],
    url: '/docs/architecture/arch',
  },
  {
    label: translate({id: 'homepage.arch.layer1', message: '硬件层'}),
    items: [
      translate({id: 'homepage.arch.hw.mcu', message: 'MCU / SoC · 蓝牙'}),
      translate({id: 'homepage.arch.hw.storage', message: '传感器 · 存储器 · 显示屏'}),
    ],
    url: '/docs/architecture/arch',
  },
];

const SCRIPT_FLOW = [
  {label: translate({id: 'homepage.arch.flow.js', message: 'JS 应用 / 表盘'}), accent: false},
  {label: 'SPM', desc: translate({id: 'homepage.arch.flow.spm', message: '生命周期管理'}), accent: false},
  {label: 'SNI', desc: translate({id: 'homepage.arch.flow.sni', message: 'API 桥接层'}), accent: false},
  {label: translate({id: 'homepage.arch.flow.native', message: '原生服务'}), accent: true},
];

function LayerCard({layer, index}) {
  const offsetStyle = index % 2 === 1 ? {marginLeft: 'clamp(0.8rem, 2vw, 1.8rem)'} : {};
  return (
    <Link to={layer.url} className={styles.layerRow} style={{...offsetStyle, animationDelay: `${index * 0.08}s`}}>
      <div className={styles.layerAccent}></div>
      <div className={styles.layerContent}>
        <span className={styles.layerLabel}>{layer.label}</span>
        <div className={styles.layerItems}>
          {layer.items.map((item, i) => (
            <span key={i} className={styles.layerItem}>{item}</span>
          ))}
        </div>
      </div>
      <svg className={styles.layerArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </Link>
  );
}

function ScriptFlow() {
  return (
    <div className={styles.flowContainer}>
      {SCRIPT_FLOW.map((item, i) => (
        <div key={i} className={styles.flowNode}>
          <div className={clsx(styles.flowDot, item.accent && styles.flowDotAccent)}></div>
          <div className={styles.flowContent}>
            <span className={clsx(styles.flowLabel, item.accent && styles.flowLabelAccent)}>{item.label}</span>
            {item.desc && <span className={styles.flowDesc}>{item.desc}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ArchitectureOverview() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.headerBlock}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="homepage.arch.heading">六层分层设计，从硬件到应用清晰解耦</Translate>
          </Heading>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.arch.subtitle">每层职责明确，向上提供统一 API，向下适配不同硬件平台。</Translate>
          </p>
        </div>
        <div className={styles.archWrap}>
          <div className={styles.layerStack}>
            {LAYERS.map((layer, i) => (
              <LayerCard key={i} layer={layer} index={i} />
            ))}
          </div>
          <div className={styles.flowSidebar}>
            <p className={styles.flowTitle}>
              <Translate id="homepage.arch.flowTitle">脚本运行时模型</Translate>
            </p>
            <ScriptFlow />
            <p className={styles.flowNote}>
              <Translate id="homepage.arch.flowNote">每个应用拥有独立的 Realm 隔离环境，SPM 管理生命周期，SNI 提供统一 API 桥接。</Translate>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
