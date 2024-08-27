import Footer from "./Footer";
import Header from "./Header";
import WalletProvider from "@/components/WalletProvider";

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <WalletProvider>
            <main className="flex flex-col min-h-screen">
                <Header />
                {children}
                <Footer />
            </main>
        </WalletProvider>
    );
}

export default Layout;