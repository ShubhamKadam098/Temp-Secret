import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <nav className="surface-card mx-auto flex w-full max-w-7xl items-center justify-between rounded-[22px] px-4 py-3 sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <Image
              src="/icons/logo.svg"
              width={28}
              height={28}
              alt="Temp Secrets logo"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Temp Secrets
            </p>
            <p className="hidden text-sm text-muted-foreground sm:block">
              One-time links for sensitive sharing
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/ShubhamKadam098"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-foreground transition-[background-color,border-color] hover:bg-white/[0.06]"
          >
            <Image
              src="/icons/github-Icon.svg"
              width={18}
              height={18}
              alt="GitHub"
            />
            GitHub
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
