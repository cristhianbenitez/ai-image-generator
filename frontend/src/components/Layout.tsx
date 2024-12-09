import { Sidebar } from '@components/Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex items-center">
      <Sidebar />
      {children}
    </div>
  );
};
