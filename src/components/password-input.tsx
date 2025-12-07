import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {

  return (
    <div className="relative">
      <Input
        type="password"
        className={cn("[&::-ms-reveal]:hidden", className)}
        {...props}
      />
    </div>
  );
}
