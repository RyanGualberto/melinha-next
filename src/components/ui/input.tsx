import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeClosed } from "lucide-react";

function Input({
  className,
  type,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
}) {
  const [hidePassword, setHidePassword] = React.useState(false);
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 ">{icon}</div>
      )}
      <input
        type={type === "password" ? (hidePassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          {
            "pl-9": Boolean(icon),
          },
          className
        )}
        {...props}
      />
      {type === "password" && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          type="button"
          onClick={() => setHidePassword(!hidePassword)}
        >
          {hidePassword ? <Eye /> : <EyeClosed />}
        </Button>
      )}
    </div>
  );
}

export { Input };
