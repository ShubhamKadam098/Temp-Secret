"use client";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import DisplayLink from "@/components/DisplayLink";
import toast from "react-hot-toast";
import { inputType } from "@/types/inputTypes";
import validateURL from "@/lib/ValidateURL";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<inputType>("text");
  const [returnedLink, setReturnedLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    let value;

    switch (currentTab) {
      case "file":
        value = file;
        break;
      case "link":
        if (!validateURL(link)) {
          toast.error("Please provide valid URL");
          setIsLoading(false);
          return;
        }
        value = link;
        break;
      default:
        value = text;
    }

    if (!value) {
      toast.error("Please enter a value");
      setIsLoading(false);
      return;
    }

    if (currentTab === "file" && value instanceof File) {
      // Validate file size
      if (value.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        setIsLoading(false);
        return;
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(value.type)) {
        toast.error("Invalid file type. Only images and PDFs are allowed");
        setIsLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("inputType", currentTab);
    if (currentTab === "file" && value instanceof File) {
      formData.append("file", value);
    } else {
      formData.append("input", value as string);
    }
    formData.append("password", password);

    const createLink = async () => {
      try {
        const res = await axios.post("/api/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (!res.data.success) {
          throw new Error("Error while creating link");
        }
        return res.data.link;
      } catch (error) {
        toast.error("Error while creating link");
        setIsLoading(false);
        return null;
      }
    };

    const responseLink = await toast.promise(createLink(), {
      loading: "Creating link...",
      success: "Link created successfully!",
      error: "Could not create link.",
    });

    if (responseLink) {
      setReturnedLink(responseLink);
    }

    setText("");
    setLink("");
    setFile(undefined);
    setPassword("");
    setIsLoading(false);
  };

  return (
    <section className="flex max-w-full flex-col gap-10 text-white">
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
          defaultValue={currentTab}
          onValueChange={(value: string) => {
            setCurrentTab(value as inputType);
          }}
          className="max-w-[700px] w-full h-fit min-w-fit bg-dark-1 border border-slate-500 rounded-lg mx-auto mt-10 md:px-6"
        >
          <TabsList className="flex gap-7 bg-transparent h-14 p-2">
            <TabsTrigger value="text" disabled={isLoading}>
              Text
            </TabsTrigger>
            <TabsTrigger value="file" disabled={isLoading}>
              Files
            </TabsTrigger>
            <TabsTrigger value="link" disabled={isLoading}>
              Redirect
            </TabsTrigger>
          </TabsList>
          <div className="border-b border-slate-500 min-h-[20px] px-10 pb-6">
            <TabsContent value="text">
              <h5 className="text-sm font-semibold mb-4">Message</h5>
              <Textarea
                placeholder="Hello World"
                className="border-slate-400"
                disabled={isLoading}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="file">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="file">File</Label>
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .pdf"
                      disabled={isLoading}
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) setFile(e.target.files[0]);
                      }}
                      className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm  file:bg-slate-200 hover:file:bg-slate-300 border border-slate-500 rounded-lg file:rounded-lg file:font-semibold"
                    />
                    {file ? (
                      <X
                        className="cursor-pointer rounded-full transition-all ease-in-out hover:bg-slate-400"
                        onClick={() => {
                          if (isLoading) return;
                          setFile(undefined);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <p className="text-sm text-slate-400 pl-2">
                    Supports: .png, .jpg, .jpeg, .pdf (Max 5MB)
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="link">
              <h5 className="text-sm font-semibold mb-4">Link</h5>
              <Input
                type="url"
                className="border-slate-400 w-full"
                placeholder="https://example.com"
                disabled={isLoading}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </TabsContent>
          </div>

          <div className="px-10">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger disabled={isLoading}>
                  More Options
                </AccordionTrigger>
                <AccordionContent className="border-b border-slate-500 mb-4">
                  <div className="grid w-full items-center gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type={isShowPassword ? "text" : "password"}
                      id="password"
                      placeholder="********"
                      value={password}
                      disabled={isLoading}
                      className="border-slate-400"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms2"
                        className="border border-slate-500 focus:border focus:border-white"
                        checked={isShowPassword}
                        disabled={isLoading}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      />
                      <label
                        htmlFor="terms2"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Show password
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex w-full items-center justify-end mb-4 px-8">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                variant={"secondary"}
                onClick={handleSubmit}
                className="focus:border-white focus:border-2 focus:bg-slate-300"
              >
                Create Secret
              </Button>
            )}
          </div>
        </Tabs>
      )}
    </section>
  );
};

export default HomePage;
