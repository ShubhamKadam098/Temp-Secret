"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisplayLink from "@/components/DisplayLink";
import { TextSecretForm, LinkSecretForm, FileSecretForm } from "@/components/forms";

import { parseAsStringLiteral, useQueryState } from "nuqs";
const secretModeValues = ["text", "file", "link"] as const;
type SecretMode = (typeof secretModeValues)[number];

const isSecretMode = (value: string): value is SecretMode =>
  secretModeValues.includes(value as SecretMode);

const HomePageContent = () => {
  const [returnedLink, setReturnedLink] = useState("");
      const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(secretModeValues).withDefault("text")
  );

  return (
    <section className="flex max-w-full flex-col gap-10 text-primary">
      <h1 className="text-2xl md:text-3xl font-semibold text-center">
        {returnedLink ? "Share Your Secret" : "Create a Secret"}
      </h1>
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
          <TabsList className="flex gap-7 bg-transparent h-14 p-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">Files</TabsTrigger>
            <TabsTrigger value="link">Redirect</TabsTrigger>
          </TabsList>
          
          <div className="border-b border-border min-h-[20px] px-10 pb-6">
            <TabsContent value="text">
              <TextSecretForm onSuccess={setReturnedLink} />
            </TabsContent>

            <TabsContent value="file">
              <FileSecretForm onSuccess={setReturnedLink} />
            </TabsContent>

            <TabsContent value="link">
              <LinkSecretForm onSuccess={setReturnedLink} />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </section>
  );
};

const HomePage = () => (
  <Suspense fallback={null}>
    <HomePageContent />
  </Suspense>
);

export default HomePage;
