"use client";
import { useState } from "react";
import NoMessageFound from "@/components/NoMessageFound";
import ShowMessage from "@/components/ShowMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Unlock } from "lucide-react";
import { useFetchSecret } from "@/hooks/useSecret";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const SecretsPage = ({ params }: { params: { id: string } }) => {
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isMessageAvailable, setIsMessageAvailable] = useState(true);

  const { mutate: fetchMessage, isPending: isLoading, data, reset } = useFetchSecret({ id: params.id });

  const handleFetchMessage = () => {
    reset();
    setIsPasswordRequired(false);
    setIsMessageAvailable(true);

    fetchMessage(password, {
      onSuccess: (data) => {
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
    <section className="text-foreground flex mx-auto justify-center min-h-36 p-4 min-w-fit ">
      <div className="flex  gap-6 flex-col  rounded-lg   w-full md:min-w-[500px] lg:w-auto">
        <h1 className="text-xl md:text-2xl font-bold">Knock Knock</h1>
        <h4 className="font-semibold text-sm md:text-base">
          You have received a secret
        </h4>
        {isMessageAvailable ? (
          <>
            {isPasswordRequired ? (
              <div className=" flex flex-wrap items-center gap-8  border border-border rounded-lg bg-card px-4 py-8 ">
                <h1 className="text-sm md:text-base">Password is required</h1>
                <Input
                  type="password"
                  placeholder="Enter password"
                  disabled={isLoading}
                  value={password}
                  className="w-[90%] mx-auto"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isLoading ? (
                  <Button
                    disabled
                    className="bg-destructive text-destructive-foreground flex items-center justify-center w-[90%] mx-auto"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    disabled={isLoading}
                    variant="destructive"
                    className="flex gap-3 w-[90%] max-w-full focus:ring-2 focus:ring-offset-2 mx-auto"
                    onClick={handleFetchMessage}
                  >
                    <Unlock
                      width={20}
                      height={20}
                      className="hidden md:block"
                    />
                    Reveal Secret
                  </Button>
                )}
              </div>
            ) : (
              <>
                {message ? (
                  <ShowMessage inputType={inputType} message={message} contentType={contentType} fileName={fileName} />
                ) : (
                  <div className="flex flex-wrap items-center gap-8 md:gap4 border border-border rounded-lg bg-card px-4 py-8 ">
                    <p className="text-sm md:text-base">
                      Be aware! The following secret can only be revealed one
                      time.
                    </p>
                    {isLoading ? (
                      <Button
                        disabled={isLoading}
                        variant="destructive"
                        className="flex gap-2 focus:ring-2 focus:ring-offset-2 px-20"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        disabled={isLoading}
                        variant="destructive"
                        className="px-5 flex gap-2 mx-auto break-words whitespace-normal h-fit focus:ring-2 focus:ring-offset-2"
                        onClick={handleFetchMessage}
                      >
                        <Unlock
                          width={20}
                          height={20}
                          className="hidden md:block"
                        />
                        Reveal Your Secret
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
