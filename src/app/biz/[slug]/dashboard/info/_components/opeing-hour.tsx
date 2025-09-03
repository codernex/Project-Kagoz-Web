"use client";

import { CustomButton } from "@/components/shared/custom-button";
import TimePicker from "@/components/shared/time-picker";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useGetBusinessBySlugQuery, useSetOpeningHoursMutation } from "@/redux/api";
import { MinusCircle, PlusCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";

interface TimeRange {
    from: {
        hours: string;
        minutes: string;
        period: string;
    };
    to: {
        hours: string;
        minutes: string;
        period: string;
    };
}

interface OpeningHourFormValues {
    days: {
        day: string;
        isOpen: boolean;
        timeRanges: TimeRange[];
    }[];
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const OpeningHour = () => {

    const { slug } = useParams() as { slug: string }
    const { data } = useGetBusinessBySlugQuery(slug, { skip: !slug })

    const defaultValues = useMemo(() => {
        return {
            days: daysOfWeek.map((day) => {
                if (data?.openingHours.length) {
                    const openingHours = data.openingHours.find(d => d.day === day)
                    return {
                        day: openingHours?.day || '',
                        isOpen: openingHours?.isOpen || true,
                        timeRanges: openingHours?.timeRanges.map(time => {

                            return {
                                from: {
                                    hours: time.fromHours,
                                    minutes: time.fromMinutes,
                                    period: time.fromPeriod

                                },
                                to: {
                                    hours: time.toHours,
                                    minutes: time.toMinutes,
                                    period: time.toPeriod
                                }
                            }
                        }) as TimeRange[] || [
                                {
                                    from: { hours: "", minutes: "", period: "" },
                                    to: { hours: "", minutes: "", period: "" },
                                },
                            ],
                    }
                } else {
                    return {
                        day,
                        isOpen: true,
                        timeRanges: [
                            {
                                from: { hours: "", minutes: "", period: "" },
                                to: { hours: "", minutes: "", period: "" },
                            },
                        ],
                    }
                }
            })
        }
    }, [data])
    const form = useForm<OpeningHourFormValues>({
        defaultValues: defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const [update] = useSetOpeningHoursMutation()

    const onSubmit = (data: OpeningHourFormValues) => {
        update({ slug, ...data })
    }

    // Memoized days to prevent unnecessary re-renders
    const days = useMemo(() => {
        return daysOfWeek
    }, []);



    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
            >
                <h2 className="text-[2.4rem] font-semibold">Set Opening Hours</h2>
                {days.map((day, index) => (
                    <div key={day}>
                        <FormField
                            name={`days.${index}.day`} // Correct field path
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className=" flex items-center gap-10 flex-wrap border-b border-b-[#ededed] py-6">
                                        <span className="w-32">{day}</span>
                                        <FormField
                                            render={({ field }) => {
                                                return (
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={(e) => field.onChange(e)} // Update isOpen value
                                                    />
                                                )
                                            }}
                                            name={`days.${index}.isOpen`}
                                            control={form.control}
                                        />
                                        {
                                            form.watch(`days.${index}.isOpen`) ? (
                                                <>
                                                    <div className="flex flex-col gap-y-3">
                                                        {
                                                            form.watch(`days.${index}.timeRanges`).map((_, i) => {
                                                                return (
                                                                    <div key={i} className="flex flex-wrap items-center gap-8">
                                                                        <div className="flex flex-wrap gap-6">
                                                                            <FormField
                                                                                name={`days.${index}.timeRanges.${i}.from`}
                                                                                control={form.control}
                                                                                render={({ field }) => (
                                                                                    <TimePicker value={field.value} onTimeChange={field.onChange} />
                                                                                )}
                                                                            />
                                                                            <FormField
                                                                                name={`days.${index}.timeRanges.${i}.to`}
                                                                                control={form.control}
                                                                                render={({ field }) => (
                                                                                    <TimePicker value={field.value} onTimeChange={field.onChange} />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <PlusCircleIcon className="cursor-pointer" onClick={() => form.setValue(`days.${index}.timeRanges`, [...form.watch(`days.${index}.timeRanges`), {
                                                        from: { hours: '', minutes: '', period: '' },
                                                        to: { hours: '', minutes: '', period: '' }
                                                    }])} />
                                                    <MinusCircle className="cursor-pointer" onClick={() => form.setValue(`days.${index}.timeRanges`, form.watch(`days.${index}.timeRanges`).filter((_, i) => {
                                                        return i !== form.watch(`days.${index}.timeRanges`).length - 1
                                                    }))} />
                                                </>
                                            ) : null
                                        }
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                ))}

                <CustomButton type="submit" variant="outline" className="max-w-fit">
                    Save Opening Hours
                </CustomButton>
            </form>
        </Form>
    );
};
