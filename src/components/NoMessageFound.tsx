import { Frown } from "lucide-react";
import React from "react";

const NoMessageFound = () => {
  return (
    <div className="flex items-center p-5 bg-rose-900 border border-red-600 rounded-lg min-h-32 gap-4 max-w-[700px]">
      <Frown className="" />
      <p className="break-words text-sm">
        Secret not found - This usually means the secret link has already been
        visited and therefore no longer exists.
      </p>
    </div>
  );
};

export default NoMessageFound;
