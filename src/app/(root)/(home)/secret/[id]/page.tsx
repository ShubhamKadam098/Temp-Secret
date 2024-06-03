"use client";
import NoMessageFound from "@/components/NoMessageFound";
import ShowMessage from "@/components/ShowMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldAlert, Unlock } from "lucide-react";
import useFetchMessage from "@/hooks/useFetchMessage";

const SecretsPage = ({ params }: { params: { id: string } }) => {
  const {
    password,
    setPassword,
    message,
    inputType,
    isMessageAvailable,
    isPasswordRequired,
    isLoading,
    fetchMessage,
  } = useFetchMessage(params.id);

  return (
    <section className="flex max-w-full flex-col gap-10 text-white">
      <div className="flex flex-col gap-8 max-w-[700px] w-full h-fit min-w-max mx-auto mt-10 px-6">
        <h1 className="text-2xl font-bold">Knock Knock</h1>
        <h4>You have received a secret</h4>
        {isMessageAvailable ? (
          <>
            {isPasswordRequired ? (
              <div className="flex flex-col p-5 bg-dark-1 border border-slate-500 rounded-lg min-h-32 gap-6">
                <h1>Password is required</h1>
                <Input
                  type="password"
                  placeholder="Enter password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isLoading ? (
                  <Button
                    disabled
                    className="border-rose-600 border bg-red-600 text-white"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    disabled={isLoading}
                    className="flex gap-3 bg-red-700 hover:bg-red-800 focus:outline-none focus:border hover:border focus:border-white  hover:border-white"
                    onClick={fetchMessage}
                  >
                    <Unlock width={20} height={20} />
                    Reveal Secret
                  </Button>
                )}
              </div>
            ) : (
              <>
                {message ? (
                  <ShowMessage inputType={inputType} message={message} />
                ) : (
                  <div className="flex items-center p-5 bg-dark-1 border border-slate-500 rounded-lg min-h-32 gap-6 focus:ring focus:ring-violet-300">
                    <p className="text-sm">
                      Be aware! The following secret can only be revealed one
                      time.
                    </p>
                    {isLoading ? (
                      <Button
                        disabled={isLoading}
                        variant={"destructive"}
                        className="px-5 bg-red-800 rounded-md border border-slate-400 w-[35%] flex gap-2 hover:border hover:border-white focus:border-2 focus:border-white"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        disabled={isLoading}
                        variant={"destructive"}
                        className="px-5 bg-red-800 rounded-md border border-slate-400 w-[35%] flex gap-2 hover:border hover:border-white focus:border-2 focus:border-white"
                        onClick={fetchMessage}
                      >
                        <Unlock width={20} height={20} />
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
