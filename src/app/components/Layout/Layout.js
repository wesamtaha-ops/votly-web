'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { NavigationProvider, useNavigation } from '../../contexts/NavigationContext';
import styles from './Layout.module.css';

const LayoutContent = ({ children }) => {
  const searchParams = useSearchParams();
  const { isNavigating } = useNavigation();
  const isMobileApp = searchParams.get('isMobileApp') === 'true';

  return (
    <div className={!isMobileApp ? '' : styles.layout}>
      {!isMobileApp && <Header />}
      <main className={styles.main}>{children}</main>
      {!isMobileApp && <Footer />}
      <LoadingScreen isVisible={isNavigating} />
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <NavigationProvider>
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  );
};

export default Layout;
