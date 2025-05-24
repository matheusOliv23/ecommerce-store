import React from 'react';
import Image from 'next/image';

export default function LoadingPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src='/loader.gif' alt='Loading...' width={150} height={150} />
    </div>
  );
}
