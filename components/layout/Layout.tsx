"use client";
import DexList from "./DexList";
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
      <div className="flex-1">{children}</div>
      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
