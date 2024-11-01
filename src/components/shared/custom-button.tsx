import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
type IButtonProps = ButtonProps & React.PropsWithChildren;
export const CustomButton = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (props, ref) => {
    return (
      <Button
        className={cn(props.className, "w-full rounded-xl")}
        {...props}
        ref={ref}
      >
        {props.children}
      </Button>
    );
  },
);

CustomButton.displayName = "CustomButton";
