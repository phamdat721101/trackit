"use client";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex flex-col min-h-screen justify-between">
      <Header />
      <div className="flex-1 h-full">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
