// src/components/shared/text-input.tsx
import { InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Control, FieldPath, RegisterOptions } from 'react-hook-form';
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

interface TextInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<InputProps, 'name'> {
    name?: TName;
    control?: Control<TFieldValues>;
    label?: string;
    variant?: 'primary' | 'secondary';
    placeholderIcon?: React.ElementType;
    rules?: RegisterOptions<TFieldValues, TName>;
}

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
    rules,
    ...props
}: TextInputProps<TFieldValues, TName>) {
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
                                    {(() => {
                                        // Avoid passing defaultValue alongside field.value (controlled input)
                                        const { defaultValue, ...safeProps } = props as any

                                        // wrapper onChange to auto-prefix website field
                                        const handleChange = (e: any) => {
                                            // get raw value (works for both event and direct value)
                                            const raw = e && e.target ? e.target.value : e;

                                            if (field.name === 'website') {
                                                // remove existing protocol and optional www.
                                                const domain = String(raw || '').replace(/^https?:\/\/(www\.)?/i, '').trim();

                                                if (!domain) {
                                                    // keep empty if user cleared input
                                                    field.onChange('');
                                                } else {
                                                    // set normalized value with https://www.<domain>
                                                    // (keeps it simple — always prefix https://www.)
                                                    field.onChange(`https://www.${domain}`);
                                                }
                                            } else {
                                                // default behaviour for other fields
                                                field.onChange(e);
                                            }
                                        };

                                        return (
                                            <Input
                                                className={cn(
                                                    'sm:placeholder:text-[16px] placeholder:text-[14px] placeholder: text-black  placeholder:text-muteds',
                                                    props.className,
                                                    PlaceholderIcon ? 'pl-14' : ''
                                                )}
                                                key={inputType}
                                                type={inputType}
                                                {...field}
                                                {...safeProps}
                                                // override onChange to our wrapper
                                                onChange={handleChange}
                                            />
                                        )
                                    })()}

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
            rules={rules}
        />
    );
}
