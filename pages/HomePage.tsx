import React from 'react';
import HeroSection from '../components/home/HeroSection';
import Features from '../components/home/Features';
import CategorySection from '../components/home/CategorySection';
import BestSellers from '../components/home/BestSellers';
import GameHub from '../components/home/GameHub';
import NewsSection from '../components/home/NewsSection';
import { User } from '../shared/types';

interface HomePageProps {
  onNavigateProduct?: (id: string) => void;
  onNavigateProducts: () => void;
  user: User | null;
  onToggleWishlist: (productId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateProduct, onNavigateProducts, user, onToggleWishlist }) => {
  return (
    <main className="flex-1 w-full bg-white">
      <HeroSection />
      <Features />
      <CategorySection onNavigateProducts={onNavigateProducts} />
      <BestSellers onNavigateProduct={onNavigateProduct} onNavigateProducts={onNavigateProducts} user={user} onToggleWishlist={onToggleWishlist} />
      <GameHub />
      <NewsSection />
    </main>
  );
};

export default HomePage;