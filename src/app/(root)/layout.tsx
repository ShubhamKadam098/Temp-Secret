import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Temp Secrets",
  description: "Share your secrets",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const rootLayout = ({ children }: { children: ReactNode }) => {
  return <main>{children}</main>;
};

export default rootLayout;
