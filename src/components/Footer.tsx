import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative py-2 bg-dark-1 text-white border-t border-slate-400 border-solid w-full">
      <div className=" flex items-center justify-center mx-auto px-2">
        <Link
          href="https://github.com/ShubhamKadam098"
          target="_blank"
          className="flex flex-wrap items-center gap-2 text-xs md:text-sm"
          rel="noreferrer"
        >
          <Image
            width="40"
            height="40"
            src={"/icons/github-Icon.svg"}
            alt="github"
            className="aspect-square h-[25px] md:h-[50px] mx-auto"
          />
          @ShubhamKadam098
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
