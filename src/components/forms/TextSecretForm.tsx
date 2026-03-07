"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { createSecretText } from "@/lib/api/secret";
import { textSecretSchema, TextSecretFormData } from "@/types/schemas";
import toast from "react-hot-toast";

interface TextSecretFormProps {
  onSuccess: (link: string) => void;
}

export function TextSecretForm({ onSuccess }: TextSecretFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

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
    } catch {
      toast.error("Error while creating link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Message</label>
        <textarea
          {...register("text")}
          placeholder="Hello World"
          className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
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
          id="showPassword"
          checked={isShowPassword}
          disabled={isLoading}
          onCheckedChange={() => setIsShowPassword(!isShowPassword)}
        />
        <label htmlFor="showPassword" className="text-sm font-medium">
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
