'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: "Physical Activity", options: ["Yoga Instructor", "Pilates Instructor", "Tai Chi/Qigong"] },
  { name: "Traditional Medicine", options: ["Ayurveda Consultant", "Naturopath", "Herbalist", "Aromatherapy"] },
  { name: "Social Life Coaching", options: ["Social Life Coach", "Intimacy & Relationship", "Mindfulness/Stress", "Career/Life Transition", "Financial Wellness"] },
  { name: "Spirituality & Meditation", options: ["Spiritual Coach", "Meditation Instructor", "Mindfulness", "Chakra Meditation", "Breathwork"] },
];

export default function CategorySelector({ onSelect }: { onSelect: (category: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 text-center">Select Your Path</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase">{cat.name}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.options.map((option) => (
                <button
                  key={option}
                  onClick={() => { setSelected(option); onSelect(option); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                    selected === option 
                      ? 'bg-cyan-600 text-white border-cyan-600' 
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-cyan-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}