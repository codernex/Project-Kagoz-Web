"use client";

import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TimePicker from "@/components/shared/time-picker";
import { useCallback, useMemo } from "react";

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
    const { control, handleSubmit, setValue, getValues, watch } = useForm<OpeningHourFormValues>({
        defaultValues: {
            days: daysOfWeek.map((day) => ({
                day,
                isOpen: false,
                timeRanges: [
                    {
                        from: { hours: "", minutes: "", period: "" },
                        to: { hours: "", minutes: "", period: "" },
                    },
                ],
            })),
        },
    });

    const onSubmit = useCallback((data: OpeningHourFormValues) => {
        console.log("Submitted data:", data);
    }, []);

    // Memoized days to prevent unnecessary re-renders
    const days = useMemo(() => daysOfWeek, []);

    console.log(watch('days'));


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
        >
            <h2 className="text-lg font-semibold">Set Opening Hours</h2>
            {days.map((day, index) => (
                <div key={day} className="space-y-4">
                    {/* Day and Open/Close Switch */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{day}</h3>
                        <Controller
                            name={`days.${index}.isOpen`}
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <Label>{field.value ? "Open" : "Closed"}</Label>
                                </div>
                            )}
                        />
                    </div>

                    {/* Time Ranges */}
                    <Controller
                        name={`days.${index}.timeRanges`}
                        control={control}
                        render={({ field }) => (
                            <div className="ml-6 space-y-4">
                                {field.value.map((range, rangeIndex) => (
                                    <div key={rangeIndex} className="flex items-center gap-4">
                                        <TimePicker
                                            value={range.from}
                                            onTimeChange={(updatedValue) =>
                                                field.onChange(
                                                    field.value.map((r, i) =>
                                                        i === rangeIndex ? { ...r, from: updatedValue } : r
                                                    )
                                                )
                                            }
                                        />

                                        <span>to</span>
                                        <TimePicker
                                            value={range.to}
                                            onTimeChange={(updatedValue) =>
                                                field.onChange(
                                                    field.value.map((r, i) =>
                                                        i === rangeIndex ? { ...r, from: updatedValue } : r
                                                    )
                                                )
                                            }
                                        />

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                field.onChange(
                                                    field.value.filter((_, i) => i !== rangeIndex)
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        setValue(
                                            `days.${index}.timeRanges`,
                                            [
                                                ...getValues(`days.${index}.timeRanges`),
                                                {
                                                    from: { hours: "", minutes: "", period: "" },
                                                    to: { hours: "", minutes: "", period: "" },
                                                },
                                            ]
                                        )
                                    }
                                >
                                    Add Time Range
                                </Button>
                            </div>
                        )}
                    />
                </div>
            ))}

            <Button type="submit" variant="outline" className="w-full">
                Save Opening Hours
            </Button>
        </form>
    );
};
