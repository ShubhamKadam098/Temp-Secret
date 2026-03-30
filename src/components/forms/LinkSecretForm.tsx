"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { createSecretLink, getErrorMessage, isRateLimitError } from "@/lib/api/secret";
import { linkSecretSchema, LinkSecretFormData } from "@/types/schemas";
import { toast } from "sonner";
import validateURL from "@/lib/ValidateURL";

interface LinkSecretFormProps {
  onSuccess: (link: string) => void;
}

export function LinkSecretForm({ onSuccess }: LinkSecretFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LinkSecretFormData>({
    resolver: zodResolver(linkSecretSchema),
    defaultValues: {
      link: "",
      password: "",
    },
  });

  const onSubmit = async (data: LinkSecretFormData) => {
    if (!validateURL(data.link)) {
      toast.error("Please provide a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSecretLink(data.link, data.password);
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
        <label htmlFor="secret-link" className="text-sm font-medium text-foreground">
          Redirect URL
        </label>
        <Input
          id="secret-link"
          {...register("link")}
          type="url"
          placeholder="https://example.com/private-preview…"
          disabled={isLoading}
          autoComplete="off"
        />
        {errors.link && (
          <p className="text-sm text-destructive">{errors.link.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="link-password" className="text-sm font-medium text-foreground">
          Password
          <span className="ml-2 text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <Input
            id="link-password"
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
        Create Redirect Link
      </LoadingButton>
    </form>
  );
}
