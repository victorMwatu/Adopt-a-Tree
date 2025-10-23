import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Home from "./page";


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
       <body>
       <Authprovider>{children}</Authprovider>
      </body> 
    </html>
  );
}
