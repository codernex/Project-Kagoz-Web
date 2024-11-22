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
// Define TextInputProps interface

export function TextInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    label,
    control,
    variant = 'primary',
    type,
    ...props
}: InputProps & {
    name?: TName;
    control?: Control<TFieldValues>;
    label?: string;
    variant?: 'primary' | 'secondary';
}) {
    const [show, setShow] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {

        if (type === 'password') {
            if (show) {
                setInputType('text')
            } else {
                setInputType('password')
            }
        }
    }, [show, type])
    return (
        <FormField
            render={({ field }) => {
                return (
                    <FormItem className={'w-full'}>
                        <div
                            className={cn(
                                variant === 'secondary' ? 'flex items-center' : '',
                                'w-full',
                            )}
                        >
                            {label ? (
                                <FormLabel className={'w-full max-w-fit mb-3 inline-block text-black'}>{label}</FormLabel>
                            ) : (
                                ''
                            )}
                            <FormControl className={'w-full'}>
                                <div className='relative'>
                                    <Input key={inputType} type={inputType} {...field} {...props} />

                                    {
                                        type === 'password' ? (
                                            <div onClick={() => {
                                                setShow(prev => !prev)
                                            }} className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'>
                                                {
                                                    show ? <EyeClosed className='cursor-pointer text-muted' /> : <Eye className='cursor-pointer text-muted' />
                                                }
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                );
            }}
            name={name ?? '' as any}
            control={control}
        />
    );
}