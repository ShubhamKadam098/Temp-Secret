"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { createSecretText, getErrorMessage, isRateLimitError } from "@/lib/api/secret";
import { textSecretSchema, TextSecretFormData } from "@/types/schemas";
import toast from "react-hot-toast";

interface TextSecretFormProps {
  onSuccess: (link: string) => void;
}

export function TextSecretForm({ onSuccess }: TextSecretFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const textAreaClasses =
    "flex min-h-[140px] w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/80 focus-visible:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[160px]";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TextSecretFormData>({
    resolver: zodResolver(textSecretSchema),
    defaultValues: {
      text: "",
      password: "",
    },
  });

  const onSubmit = async (data: TextSecretFormData) => {
    setIsLoading(true);
    try {
      const response = await createSecretText(data.text, data.password);
      if (response.success && response.link) {
        onSuccess(response.link);
        reset();
      } else {
        toast.error("Error while creating link");
      }
    } catch (error) {
      const message = isRateLimitError(error)
        ? "Too many requests. Please wait a moment and try again."
        : getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2.5">
        <label htmlFor="secret-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="secret-message"
          {...register("text")}
          placeholder="Paste the message, credential, or snippet you want to share once…"
          className={textAreaClasses}
          disabled={isLoading}
          rows={8}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="secret-password" className="text-sm font-medium text-foreground">
          Password
          <span className="ml-2 text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <Input
            id="secret-password"
            {...register("password")}
            type={isShowPassword ? "text" : "password"}
            placeholder="Add a password for an extra check…"
            disabled={isLoading}
            autoComplete="new-password"
            className="pr-14"
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
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <LoadingButton type="submit" isLoading={isLoading} className="w-full" size="lg">
        Create Secret Link
      </LoadingButton>
    </form>
  );
}
