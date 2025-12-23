import React, { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { User } from '../shared/types';

interface MainLayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
  cartCount?: number;
  user?: User | null;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, onSearch, currentPage, cartCount = 0, user, onLogout }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col font-sans">
      <Header 
        onNavigate={onNavigate} 
        onSearch={onSearch} 
        currentPage={currentPage} 
        cartCount={cartCount} 
        user={user}
        onLogout={onLogout}
      />
      <div className="flex-1 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;