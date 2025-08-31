import { InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Control, FieldPath } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

export type FieldValues = Record<string, any>;

export function TextInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    label,
    control,
    variant = 'primary',
    type,
    placeholderIcon: PlaceholderIcon,
    ...props
}: InputProps & {
    name?: TName;
    control?: Control<TFieldValues>;
    label?: string;
    variant?: 'primary' | 'secondary';
    placeholderIcon?: React.ElementType;
}) {
    const [show, setShow] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
        if (type === 'password') {
            setInputType(show ? 'text' : 'password');
        } else {
            setInputType(type);
        }
    }, [show, type]);

    return (
        <FormField
            render={({ field }) => {
                return (
                    <FormItem className="w-full">
                        <div
                            className={cn(
                                variant === 'secondary' ? 'flex items-center' : '',
                                'w-full',
                            )}
                        >
                            {label ? (
                                <FormLabel className="w-full  max-w-fit mb-3 inline-block text-black font-semibold text-[14px] sm:text-[16px]">
                                    {label}
                                    {props.required && <span className="text-red-500"> *</span>}
                                </FormLabel>
                            ) : null}

                            <FormControl className="w-full">
                                <div className="relative flex items-center">
                                   
                                    {PlaceholderIcon && (
                                        <PlaceholderIcon 
                                        style={{ width: '1.8rem', height: '1.8rem' }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 ml-2 mt-[2px] !text-[#949494] text-muted" />
                                    )}
                                    <Input
                                        className={cn(
                                            'sm:placeholder:text-[16px] placeholder:text-[14px] placeholder: text-black  placeholder:text-muteds',
                                            props.className,
                                            PlaceholderIcon ? 'pl-14' : '' 
                                        )}
                                        key={inputType}
                                        type={inputType}
                                        {...field}
                                        {...props}
                                    />

                                    {type === 'password' && (
                                        <div
                                            onClick={() => setShow((prev) => !prev)}
                                            className="absolute -translate-y-1/2 cursor-pointer right-3 top-1/2"
                                        >
                                            {show ? (
                                                <Eye className="cursor-pointer text-muted" />
                                            ) : (
                                                <EyeClosed className="cursor-pointer text-muted" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        </div>
                        <FormMessage className="text-red-500" />
                    </FormItem>
                );
            }}
            name={(name ?? '') as any}
            control={control}
        />
    );
}