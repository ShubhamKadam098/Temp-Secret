import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-background px-6 py-4 lg:px-10 border-b">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={35}
          height={35}
          alt="Temp Secrets logo"
          className="max-sm:size-10"
        />
        <p className="text-2xl font-semibold text-foreground max-sm:hidden">
          Temp Secrets
        </p>
      </Link>
    </nav>
  );
};

export default Navbar;
