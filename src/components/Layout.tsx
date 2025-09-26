import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

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
    </div>
  );
}

export default Layout;