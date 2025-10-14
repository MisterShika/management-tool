import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthWrapper from "@/components/AuthWrapper";

const notoSansJP = Noto_Sans_JP({
  weight: ["400"], 
  subsets: ["japanese"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSansJP.className} min-h-screen flex flex-col items-center justify-center`}>
        <Header />
        <main className="flex flex-col items-center  flex-1 w-full p-4">
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </main>
        <Footer />
      </body>
    </html>
  );
}
