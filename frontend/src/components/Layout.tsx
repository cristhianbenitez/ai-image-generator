import { Sidebar } from '@components/Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <main className="w-full h-full">{children}</main>
    </>
  );
};
