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
    <section className="text-white flex mx-auto justify-center min-h-36 p-4 min-w-fit ">
      <div className="flex  gap-6 flex-col  rounded-lg  shadow-lg w-full md:min-w-[500px] lg:w-auto">
        <h1 className="text-xl md:text-2xl font-bold">Knock Knock</h1>
        <h4 className="font-semibold text-sm md:text-base">
          You have received a secret
        </h4>
        {isMessageAvailable ? (
          <>
            {isPasswordRequired ? (
              <div className=" flex flex-wrap items-center gap-8  border border-slate-400 rounded-lg bg-dark-1 px-4 py-8 ">
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
                    className="border-rose-600 border bg-red-600 text-white flex items-center justify-center w-[90%] mx-auto"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    disabled={isLoading}
                    className="flex gap-3 bg-red-700 hover:bg-red-800 w-[90%] max-w-full focus:outline-none focus:border hover:border focus:border-white  hover:border-white mx-auto"
                    onClick={fetchMessage}
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
                  <ShowMessage inputType={inputType} message={message} />
                ) : (
                  <div className="flex flex-wrap items-center gap-8 md:gap4 border border-slate-400 rounded-lg bg-dark-1 px-4 py-8 ">
                    <p className="text-sm md:text-base">
                      Be aware! The following secret can only be revealed one
                      time.
                    </p>
                    {isLoading ? (
                      <Button
                        disabled={isLoading}
                        variant={"destructive"}
                        className=" bg-red-800 rounded-md border border-slate-400  flex gap-2 hover:border hover:border-white focus:border-2 focus:border-white px-20"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        disabled={isLoading}
                        variant={"destructive"}
                        className="px-5 bg-red-800 rounded-md border border-slate-400  flex gap-2 hover:border hover:border-white focus:border-2 focus:border-white
                        mx-auto break-words whitespace-normal h-fit"
                        onClick={fetchMessage}
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
