import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-oatmeal-100 bg-paper-texture bg-fabric-texture">
      <Header />
      <Navigation />
      <main className="relative">
        {children}
      </main>
      <CartDrawer />
      <SearchModal />
    </div>
  );
}

export default Layout;