'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AvatarInterface from '@/components/AvatarInterface';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="p-8 flex justify-between items-center border-b border-gray-100">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">MINIMUM STRESS</span>
      </header>

      {/* İçerik */}
      <div className="flex flex-col items-center pt-10">
        <div className="w-full max-w-xl rounded-[40px] overflow-hidden border border-gray-100 shadow-xl">
          <AvatarInterface mode="idle" />
        </div>
        
        <div className="text-center mt-10">
          <h1 className="text-5xl font-medium mb-6">
            Your path to <br/>
            <span className="text-cyan-600">inner clarity.</span>
          </h1>
          <Link href="/session">
            <button className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-gray-800 transition-all">
              Begin Your Session →
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}