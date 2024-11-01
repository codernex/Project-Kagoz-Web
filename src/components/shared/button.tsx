import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";

interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    React.PropsWithChildren {
  asChild?: boolean;
}
export const Button: React.FC<IButtonProps> = ({
  children,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "w-full min:h-10 bg-primary text-white rounded-md border",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
