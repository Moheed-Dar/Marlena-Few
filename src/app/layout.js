import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Marlena - Coldwell Banker Southwest Realty",
  description: "Southwest Realty - Find your dream home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body 
        className="min-h-screen font-(family-name:--font-poppins)"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}