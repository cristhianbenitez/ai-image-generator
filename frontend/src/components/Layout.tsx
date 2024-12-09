import { Sidebar } from '@components/Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <main className="w-full h-full overflow-auto flex justify-center px-[72px] py-8">
        {children}
      </main>
    </>
  );
};
