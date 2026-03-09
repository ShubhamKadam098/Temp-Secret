import { AlertTriangle } from "lucide-react";
import React from "react";

const NoMessageFound = () => {
  return (
    <div className="surface-card flex min-h-32 max-w-[700px] items-start gap-4 rounded-[24px] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04]">
        <AlertTriangle aria-hidden="true" className="h-5 w-5 text-foreground" />
      </div>
      <p className="break-words text-sm leading-6 text-muted-foreground">
        Secret not found - This usually means the secret link has already been
        visited and therefore no longer exists.
      </p>
    </div>
  );
};

export default NoMessageFound;
