import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Temp Secrets",
  description: "Share your secrets",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <section
        id="main-content"
        className="relative flex flex-1 flex-col px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 lg:px-10"
      >
        <div className="relative mx-auto w-full max-w-7xl flex-1">{children}</div>
      </section>
      <Footer />
    </main>
  );
};

export default HomeLayout;
