import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <main className="flex flex-col items-center  flex-1 w-full p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
