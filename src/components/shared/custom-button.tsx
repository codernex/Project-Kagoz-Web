import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";
type IButtonProps = ButtonProps & React.PropsWithChildren & {
  isLoading?: boolean
};
export const CustomButton = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ isLoading = false, ...props }, ref) => {
    return (
      <Button
        className={cn(props.className, "w-full rounded-xl")}
        {...props}
        ref={ref}
      >
        {isLoading ? <div className="w-8 h-8 border-2 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div> : ''}
        {props.children}
      </Button>
    );
  },
);

CustomButton.displayName = "CustomButton";
