import Link from "next/link";
import { Globe } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const VisitLinkBtn = ({ inputLink }: { inputLink: string }) => {
  const resolveHref = (value: string) => {
    if (!value) return "/";
    if (value.startsWith("/")) return value;

    const hasProtocol = /^https?:\/\//i.test(value);
    const looksLikeLocalhost = /^localhost:\d+/i.test(value);
    const looksLikeDomain = /^[a-z0-9.-]+\.[a-z]{2,}(?::\d+)?(\/|$)/i.test(value);
    const normalizedValue =
      hasProtocol || looksLikeLocalhost || looksLikeDomain
        ? hasProtocol
          ? value
          : `${looksLikeLocalhost ? "http" : "https"}://${value}`
        : value;

    try {
      const url = new URL(normalizedValue);
      return `${url.pathname}${url.search}${url.hash}` || "/";
    } catch {
      return value.startsWith("/") ? value : `/${value.replace(/^\/+/, "")}`;
    }
  };

  const path = resolveHref(inputLink);

  return (
    <Button asChild variant={"outline"} className="w-full gap-2 sm:w-auto">
      <Link href={path}>
        <Globe aria-hidden="true" className="h-4 w-4" />
        Open Secret
      </Link>
    </Button>
  );
};

export default VisitLinkBtn;
