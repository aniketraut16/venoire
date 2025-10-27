'use client';

import React from 'react';
import { LoadingProvider, useLoading } from '@/contexts/LoadingContext';
import Loader from '@/components/common/Loader';

interface LoadingWrapperProps {
  children: React.ReactNode;
}

const LoadingContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <Loader />
        </div>
      )}
      {children}
    </>
  );
};

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  return (
    <LoadingProvider>
      <LoadingContent>{children}</LoadingContent>
    </LoadingProvider>
  );
};
