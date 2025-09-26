import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-oatmeal-100 bg-paper-texture bg-fabric-texture flex flex-col">
      <Header />
      <Navigation />
      <main className="relative flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </div>
  );
}

export default Layout;