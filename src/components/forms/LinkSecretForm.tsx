"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { createSecretLink } from "@/lib/api/secret";
import { linkSecretSchema, LinkSecretFormData } from "@/types/schemas";
import toast from "react-hot-toast";
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
    } catch {
      toast.error("Error while creating link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Redirect URL</label>
        <Input
          {...register("link")}
          type="url"
          placeholder="https://example.com"
          disabled={isLoading}
        />
        {errors.link && (
          <p className="text-sm text-destructive">{errors.link.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password (optional)</label>
        <Input
          {...register("password")}
          type={isShowPassword ? "text" : "password"}
          placeholder="********"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showPasswordLink"
          checked={isShowPassword}
          disabled={isLoading}
          onCheckedChange={() => setIsShowPassword(!isShowPassword)}
        />
        <label htmlFor="showPasswordLink" className="text-sm font-medium">
          Show password
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Secret"
        )}
      </Button>
    </form>
  );
}
