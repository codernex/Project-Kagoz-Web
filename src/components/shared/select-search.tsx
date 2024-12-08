'use client';

import { Check, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';
import React from 'react';
type Option<T> = {
    [key in keyof T]: T[key];
};

interface SelectSearch<T extends { id: string | number; name: string }> {
    valueKey?: keyof T;
    options?: Option<T>[];
    value: Option<T>['id' | 'name'];
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean
}


export const SelectSearch = <T extends { id: string | number; name: string }>({
    options,
    valueKey = 'id',
    value,
    onChange,
    placeholder = 'Select Data',
    disabled = false
}: SelectSearch<T>) => {
    const [open, setOpen] = React.useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'max-w-full justify-between rounded-[.8rem] ',
                        !value && 'text-muted-foreground',
                    )}
                >
                    {value
                        ? options?.find((language) => language[valueKey] === value)?.name
                        : placeholder}
                    <ChevronDown className="w-8 h-8 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-none ">
                <Command className='border-none'>
                    <CommandInput className='h-[4rem] border-b-0 border-none placeholder:text-muted w-full rounded-s text-black' placeholder={placeholder} />
                    <CommandEmpty>No Data Found</CommandEmpty>
                    <CommandGroup>
                        <CommandList className='overflow-y-scroll h-[250px] scrollbar-thin !border-none'>
                            {options?.map((language) => (
                                <CommandItem
                                    value={language.name}
                                    key={language.id}
                                    className='text-black cursor-pointer hover:bg-slate-100 hover:text-black'
                                    onSelect={() => {
                                        onChange(language[valueKey]);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-6 w-6',
                                            language[valueKey] === value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {language.name}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};