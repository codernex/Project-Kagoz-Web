import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Control, FieldPath } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  placeholderIcon?: LucideIcon
  required?: boolean
  character?: number // dynamic character limit
  name?: FieldPath<any>
  control?: Control<any>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, placeholderIcon: PlaceholderIcon, required, character, control, name, ...props }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const isEmpty = required && (!props.value || (typeof props.value === 'string' && props.value.trim() === ''));

    // If control and name are provided, render RHF-aware field
    if (control && name) {
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              {label && (
                <FormLabel className="common-text !text-start text-[#111827] flex items-center">
                  {label}
                  {required && <span className="ml-1 text-red-600">*</span>}
                </FormLabel>
              )}
              <FormControl>
                <div className="flex items-start border border-[#E4E4E4] rounded-[8px] px-3 py-2 !mt-2 bg-transparent">
                  {PlaceholderIcon && <PlaceholderIcon className="w-[16px] h-[16px] text-[#949494] mr-2" />}
                  <textarea
                    placeholder={props.placeholder}
                    required={required}
                    maxLength={character ?? props.maxLength}
                    className={cn(
                      "w-full outline-none bg-transparent text-[16px] text-[#353535] placeholder:text-[#949494] resize-none",
                      className
                    )}
                    {...field}
                    {...props}
                    onBlur={(e) => { setTouched(true); field.onBlur(); props.onBlur?.(e); }}
                  />
                </div>
              </FormControl>
              <FormMessage />
              {typeof field.value === 'string' && (
                <p className="text-xs text-gray-500 mt-1 text-end">
                  {field.value.length}/{character ?? '∞'} characters
                </p>
              )}
            </FormItem>
          )}
        />
      )
    }

    // Default non-RHF rendering
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="common-text !text-start text-[#111827] flex items-center">
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}
        <div className="flex items-start border border-[#E4E4E4] rounded-[8px] px-3 py-2 !mt-2 bg-transparent">
          {PlaceholderIcon && <PlaceholderIcon className="w-[16px] h-[16px] text-[#949494] mr-2" />}
          <textarea
            ref={ref}
            placeholder={props.placeholder}
            required={required}
            maxLength={character ?? props.maxLength}
            className={cn(
              "w-full outline-none bg-transparent text-[16px] text-[#353535] placeholder:text-[#949494] resize-none",
              className
            )}
            {...props}
            onBlur={(e) => { setTouched(true); props.onBlur?.(e); }}
          />
        </div>
        {isEmpty && touched && (
          <p className="text-xs text-red-500 mt-1">{label} is required</p>
        )}
        {typeof props.value === 'string' && (
          <p className="text-xs text-gray-500 mt-1 text-end">
            {props.value.length}/{character ?? '∞'} characters
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }