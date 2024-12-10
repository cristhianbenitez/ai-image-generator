import { Sidebar } from '@components';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      {/* TODO: Add responsive layout... mobile first lg:w-full */}
      <main className="w-full h-full overflow-auto flex justify-center px-[72px] py-8">
        {children}
      </main>
    </>
  );
};
