"use client";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
