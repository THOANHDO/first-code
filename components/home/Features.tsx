import React, { useEffect, useState } from 'react';
import { DataService } from '../../backend/api';
import { Feature } from '../../shared/types';

const Features: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    DataService.getFeatures().then(setFeatures);
  }, []);

  if (features.length === 0) return null;

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => (
            <div key={item._id} className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className={`size-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-slate-800 text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;