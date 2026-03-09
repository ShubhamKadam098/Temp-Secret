import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Secure one-time sharing for text, files, and redirects.</p>
        <Link
          href="https://github.com/ShubhamKadam098"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-white"
        >
          Built by @ShubhamKadam098
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
