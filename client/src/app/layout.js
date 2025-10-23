import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Adopt A Tree",
  description: "A platform to promote tree adoption and environmental conservation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <body className="flex min-h-screen flex-col items-center justify-between ">
       <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body> 
    </html>
  );
}
