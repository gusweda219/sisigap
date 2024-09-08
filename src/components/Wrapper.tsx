import { cn } from "@/lib/utils";

export const Wrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-background p-4 rounded-md", className)} {...props} />
  );
};
