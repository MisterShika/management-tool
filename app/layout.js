import { Noto_Sans_JP } from 'next/font/google';
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthWrapper from "@/components/AuthWrapper";

const notoSansJP = Noto_Sans_JP({
  weight: ["400"], 
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSansJP.className} min-h-screen flex flex-col items-center justify-center`}>
        <AuthWrapper>
          <Header />
          <main className="flex flex-col items-center  flex-1 w-full ">
            {children}
          </main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
