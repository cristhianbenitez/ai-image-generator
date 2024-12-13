import React from 'react';

import { Sidebar } from '@components';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <main className="w-full h-full overflow-hidden overflow-y-auto flex justify-center px-[72px] py-8">
        {children}
      </main>
    </>
  );
};
