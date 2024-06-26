import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "./ui/sonner";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
        <Header />
        <div className="sm:py-16 max-w-7xl sm:mx-auto space-y-8 sm:px-6 lg:px-8">
          {children}
        </div>
        <Footer />
        <Toaster />
      </div>
    </>
  );
};

export default Layout;
