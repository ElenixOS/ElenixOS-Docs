import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function BottomCTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <Heading as="h2" className={styles.title}>
            <Translate id="homepage.bottomCTA.title">
              准备好构建下一代智能穿戴体验了吗？
            </Translate>
          </Heading>
          <p className={styles.subtitle}>
            <Translate id="homepage.bottomCTA.subtitle">
              从文档到代码，从模拟器到真机，一切从这里开始。
            </Translate>
          </p>
          <div className={styles.buttons}>
            <Link className={clsx('button button--lg', styles.primaryBtn)} to="/docs/intro">
              <Translate id="homepage.bottomCTA.docs">开始阅读文档</Translate>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              className={clsx('button button--lg', styles.secondaryBtn)}
              to="https://github.com/ElenixOS/ElenixOS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Translate id="homepage.bottomCTA.github">在 GitHub 上关注我们</Translate>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
