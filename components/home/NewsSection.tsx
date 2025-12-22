import React, { useEffect, useState } from 'react';
import { DataService } from '../../backend/api';
import { NewsArticle } from '../../shared/types';

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    DataService.getArticles().then(setArticles);
  }, []);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-slate-900 text-2xl md:text-3xl font-bold tracking-tight">Tin Tức & Sự Kiện</h2>
          <a href="#" className="text-slate-500 hover:text-primary font-medium text-sm flex items-center gap-1 transition-colors">
            Xem thêm <span className="material-symbols-outlined text-sm">chevron_right</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <article key={article._id} className="group flex flex-col gap-4 cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200 relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${article.categoryColor}`}>
                  {article.category}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-slate-800 text-xl font-bold leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}