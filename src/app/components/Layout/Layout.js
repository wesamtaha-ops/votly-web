'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const searchParams = useSearchParams();
  const isMobileApp = searchParams.get('isMobileApp') === 'true';

  return (
    <div className={!isMobileApp ? '' : styles.layout}>
      {!isMobileApp && <Header />}
      <main className={styles.main}>{children}</main>
      {!isMobileApp && <Footer />}
    </div>
  );
};

export default Layout;
