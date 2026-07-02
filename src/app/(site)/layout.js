import "@/app/globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "COLDWELL BANKER",
  description: "Premium Real Estate Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-[#0a1628] text-white font-sans antialiased"
        suppressHydrationWarning
      >
        <Navbar />
        {/* Navbar height ke barabar padding taake content hide na ho */}
        <main >
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}