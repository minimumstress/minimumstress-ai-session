'use client';

import VideoCallClient from './VideoCallClient';
import AIChat from '@/components/AIChat';

export default function VideoCallPage() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Sol: Video asistan */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>AI Video Assistant</h2>
        <VideoCallClient />
      </div>

      {/* Sağ: Chat */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>AI Chat</h2>
        <AIChat />
      </div>
    </div>
  );
}
