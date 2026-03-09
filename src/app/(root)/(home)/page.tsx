"use client";

import DisplayLink from "@/components/DisplayLink";
import {
  FileSecretForm,
  LinkSecretForm,
  TextSecretForm,
} from "@/components/forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, PencilLine, Send, ShieldCheck } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense, useState } from "react";

const secretModeValues = ["text", "file", "link"] as const;
type SecretMode = (typeof secretModeValues)[number];

const isSecretMode = (value: string): value is SecretMode =>
  secretModeValues.includes(value as SecretMode);

const steps = [
  {
    title: "Write",
    description: "Add a secret, upload a file, or prepare a redirect.",
    icon: PencilLine,
  },
  {
    title: "Share",
    description: "Send the generated one-time link to the intended recipient.",
    icon: Send,
  },
  {
    title: "Burn",
    description:
      "After the first successful open, the link is no longer usable.",
    icon: Flame,
  },
];

const faqs = [
  {
    question: "Why use a one-time link?",
    answer:
      "It reduces the risk of sensitive information being left behind in chat history, email threads, or shared notes.",
  },
  {
    question: "What can I share?",
    answer:
      "You can create one-time links for text, supported files up to 5 MB, and private redirect URLs.",
  },
  {
    question: "Can I protect a secret with a password?",
    answer:
      "Yes. Password protection is optional and can be added to any supported secret type before the link is generated.",
  },
  {
    question: "Can a visited secret be opened again?",
    answer:
      "No. This flow is built around single-use access. Once the secret is revealed successfully, the link is no longer valid.",
  },
];

const HomePageContent = () => {
  const [returnedLink, setReturnedLink] = useState("");
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(secretModeValues).withDefault("text")
  );

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-12 pb-10 pt-2 sm:gap-14 lg:pt-6">
      <section className="space-y-7 pt-2 sm:space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:px-3.5 sm:py-1.5">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            One-Time Secret Sharing
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-balance text-[32px] font-semibold tracking-tight text-foreground sm:text-[46px] sm:leading-[1.03]">
              Share a secret with a link that only works once.
            </h1>
            <p className="max-w-2xl text-pretty text-[15px] leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Create a one-time link for text, files, or redirects. Add an
              optional password, send the link, and let the content disappear
              after the first successful open.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {returnedLink ? (
            <DisplayLink
              returnedLink={returnedLink}
              setReturnedLink={setReturnedLink}
            />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (isSecretMode(value)) {
                  setActiveTab(value);
                }
              }}
              className="surface-card rounded-[20px] p-4 sm:p-5"
            >
              <div className="mb-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="file">Files</TabsTrigger>
                  <TabsTrigger value="link">Redirect</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="text" className="mt-0">
                <TextSecretForm onSuccess={setReturnedLink} />
              </TabsContent>

              <TabsContent value="file" className="mt-0">
                <FileSecretForm onSuccess={setReturnedLink} />
              </TabsContent>

              <TabsContent value="link" className="mt-0">
                <LinkSecretForm onSuccess={setReturnedLink} />
              </TabsContent>
            </Tabs>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>Single-use links</span>
            <span className="text-white/20">/</span>
            <span>Optional passwords</span>
            <span className="text-white/20">/</span>
            <span>Text, files & redirects</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Write the secret, share the link, and let the system enforce
            single-use access.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className="rounded-[18px] border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 text-foreground"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {index + 1}. {title}
                </p>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            FAQ
          </p>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            A few practical details before you send a secret.
          </p>
        </div>

        <div className="surface-card rounded-[18px] px-4 py-2 sm:px-5">
          <Accordion type="single" collapsible>
            {faqs.map(({ question, answer }) => (
              <AccordionItem
                key={question}
                value={question}
                className="border-white/10 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-sm text-foreground hover:no-underline">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </section>
  );
};

const HomePage = () => (
  <Suspense fallback={null}>
    <HomePageContent />
  </Suspense>
);

export default HomePage;
