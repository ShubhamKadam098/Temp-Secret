"use client";
import { useState } from "react";
import NoMessageFound from "@/components/NoMessageFound";
import ShowMessage from "@/components/ShowMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, KeyRound, Loader2, Unlock } from "lucide-react";
import { useFetchSecret } from "@/hooks/useSecret";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form, FormField, FormControl, FormMessage } from "@/components/ui/form";
import { fetchSecretSchema, FetchSecretFormData } from "@/types/schemas";

const SecretsPage = ({ params }: { params: { id: string } }) => {
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isMessageAvailable, setIsMessageAvailable] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { mutate: fetchMessage, isPending: isLoading, data, reset } = useFetchSecret({ id: params.id });

  const form = useForm<FetchSecretFormData>({
    resolver: zodResolver(fetchSecretSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleFetchMessage = (data: FetchSecretFormData) => {
    reset();
    setIsPasswordRequired(false);
    setIsMessageAvailable(true);

    fetchMessage(data.password, {
      onSuccess: () => {
        toast.success("Message retrieved successfully!");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const { status } = error.response || {};
          if (status === 401) {
            setIsPasswordRequired(true);
            toast.error("Password required");
          } else if (status === 403) {
            toast.error("Incorrect password");
          } else if (status === 404) {
            setIsMessageAvailable(false);
            toast.error("Message not found");
          } else if (status === 429) {
            toast.error("Too many requests. Please wait a moment and try again.");
          } else {
            toast.error("An error occurred while retrieving the message");
          }
        } else {
          toast.error("An error occurred while retrieving the message");
        }
      },
    });
  };

  const message = data?.message || "";
  const inputType = data?.inputType || "text";
  const contentType = data?.contentType || "";
  const fileName = data?.fileName || "";

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center py-8">
      <div className="w-full space-y-6">
        <div className="space-y-4 text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:px-4 sm:py-2">
            Protected handoff
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Someone sent you a secret
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              This link can reveal its contents once. Open it only when you are ready.
            </p>
          </div>
        </div>

        {isMessageAvailable ? (
          <>
            {isPasswordRequired ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFetchMessage)}>
                  <div className="surface-card flex flex-col gap-5 rounded-[24px] p-5 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05]">
                        <KeyRound aria-hidden="true" className="h-5 w-5 text-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Password required
                      </h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Enter the password shared by the sender to unlock this secret.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div className="w-full">
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Enter password"
                                disabled={isLoading}
                                autoComplete="current-password"
                                className="pr-14"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => setIsShowPassword(!isShowPassword)}
                                disabled={isLoading}
                                aria-label={isShowPassword ? "Hide password" : "Show password"}
                              >
                                {isShowPassword ? (
                                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                                ) : (
                                  <Eye aria-hidden="true" className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </div>
                      )}
                    />
                    {isLoading ? (
                      <Button
                        disabled
                        className="w-full justify-center"
                        size="lg"
                      >
                        <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait…
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full gap-3"
                        size="lg"
                      >
                        <Unlock aria-hidden="true" className="h-4 w-4" />
                        Reveal Secret
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            ) : (
              <>
                {message ? (
                  <ShowMessage inputType={inputType} message={message} contentType={contentType} fileName={fileName} />
                ) : (
                  <div className="surface-card flex flex-col gap-6 rounded-[24px] p-5 sm:p-6">
                    <div className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05]">
                        <Unlock aria-hidden="true" className="h-5 w-5 text-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Reveal the secret
                      </h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Be aware: once this secret is opened, it will no longer be available from this link.
                      </p>
                    </div>
                    {isLoading ? (
                      <Button
                        disabled={isLoading}
                        className="w-full justify-center"
                        size="lg"
                      >
                        <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
                        Opening…
                      </Button>
                    ) : (
                      <Button
                        disabled={isLoading}
                        className="w-full gap-2 whitespace-normal"
                        size="lg"
                        onClick={() => handleFetchMessage({ password: "" })}
                      >
                        <Unlock aria-hidden="true" className="h-4 w-4" />
                        Reveal Secret Now
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <NoMessageFound />
        )}
      </div>
    </section>
  );
};

export default SecretsPage;
