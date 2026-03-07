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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DisplayLink from "@/components/DisplayLink";
import toast from "react-hot-toast";
import { inputType } from "@/types/inputTypes";
import validateURL from "@/lib/ValidateURL";
import { useCreateSecret } from "@/hooks/useSecret";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createSecretSchema, CreateSecretFormData } from "@/types/schemas";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

const HomePage = () => {
  const [currentTab, setCurrentTab] = useState<inputType>("text");
  const [returnedLink, setReturnedLink] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createSecret, isPending: isLoading } = useCreateSecret();

  const form = useForm<CreateSecretFormData>({
    resolver: zodResolver(createSecretSchema),
    defaultValues: {
      inputType: "text",
      text: "",
      link: "",
      password: "",
    },
  });

  const { mutate: uploadFile } = useCreateSecret();

  const onSubmit = (data: CreateSecretFormData) => {
    let value: string | File;

    if (data.inputType === "text") {
      value = data.text || "";
    } else if (data.inputType === "link") {
      if (!validateURL(data.link || "")) {
        form.setError("link", { message: "Please provide a valid URL" });
        return;
      }
      value = data.link || "";
    } else {
      value = data.file as File;
    }

    if (!value) {
      toast.error("Please enter a value");
      return;
    }

    if (data.inputType === "file" && value instanceof File) {
      if (value.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(value.type)) {
        toast.error("Invalid file type. Only images and PDFs are allowed");
        return;
      }
    }

    createSecret(
      {
        inputType: data.inputType,
        input: value,
        password: data.password || undefined,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.link) {
            setReturnedLink(response.link);
            form.reset();
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        },
        onError: () => {
          toast.error("Error while creating link");
        },
      }
    );
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs
              value={currentTab}
              onValueChange={(value: string) => {
                setCurrentTab(value as inputType);
                form.setValue("inputType", value as inputType);
              }}
              className="max-w-[700px] w-full h-fit min-w-fit bg-background border border-border rounded-lg mx-auto mt-10 md:px-6"
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
              <div className="border-b border-border min-h-[20px] px-10 pb-6">
                <TabsContent value="text">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Hello World"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="file">
                  <div className="grid w-full items-center gap-4">
                    <FormLabel htmlFor="file">File</FormLabel>
                    <div className="flex flex-col w-full gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .pdf"
                          disabled={isLoading}
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              form.setValue("file", e.target.files[0]);
                            }
                          }}
                          className="block w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-secondary hover:file:bg-secondary-hover border border-border rounded-lg file:rounded-lg file:font-semibold"
                        />
                        {form.watch("file") ? (
                          <X
                            className="cursor-pointer rounded-full transition-all ease-in-out hover:bg-secondary-hover"
                            onClick={() => {
                              if (isLoading) return;
                              form.setValue("file", undefined as any);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground pl-2">
                        Supports: .png, .jpg, .jpeg, .pdf (Max 5MB)
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="link">
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            className="border-border w-full"
                            placeholder="https://example.com"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>

              <div className="px-10">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger disabled={isLoading}>
                      More Options
                    </AccordionTrigger>
                    <AccordionContent className="border-b border-border mb-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type={isShowPassword ? "text" : "password"}
                                placeholder="********"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox
                          id="showPassword"
                          className="border border-border focus:border focus:border-primary"
                          checked={isShowPassword}
                          disabled={isLoading}
                          onCheckedChange={() => setIsShowPassword(!isShowPassword)}
                        />
                        <label
                          htmlFor="showPassword"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show password
                        </label>
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
                    type="submit"
                    variant={"secondary"}
                    className="focus:border-primary focus:border-2 focus:bg-secondary-hover"
                  >
                    Create Secret
                  </Button>
                )}
              </div>
            </Tabs>
          </form>
        </Form>
      )}
    </section>
  );
};

export default HomePage;
