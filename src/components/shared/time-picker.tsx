import React, { useCallback, useEffect, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
    value: { hours: string; minutes: string; period: string };
    onTimeChange: (time: { hours: string; minutes: string; period: string }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onTimeChange }) => {
    // Local state that syncs with props when they change
    const [hour, setHour] = useState(value.hours);
    const [minute, setMinute] = useState(value.minutes);
    const [period, setPeriod] = useState(value.period);

    // Sync the local state with the incoming props when they change
    useEffect(() => {
        setHour(value.hours);
        setMinute(value.minutes);
        setPeriod(value.period);
    }, [value]);

    const handleHourChange = useCallback((newHour: string) => {
        const updatedTime = { hours: newHour, minutes: minute, period };
        setHour(newHour);
        onTimeChange(updatedTime); // Notify parent of the change
    }, [minute, period, onTimeChange]);

    const handleMinuteChange = useCallback((newMinute: string) => {
        const updatedTime = { hours: hour, minutes: newMinute, period };
        setMinute(newMinute);
        onTimeChange(updatedTime); // Notify parent of the change
    }, [hour, onTimeChange, period]);

    const handlePeriodChange = useCallback((newPeriod: string) => {
        const updatedTime = { hours: hour, minutes: minute, period: newPeriod };
        setPeriod(newPeriod);
        onTimeChange(updatedTime); // Notify parent of the change
    }, [hour, minute, onTimeChange]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex bg-white border border-gray-300 divide-x divide-gray-300 rounded-[.8rem] px-6 py-4 w-[20rem]">
                {/* Hour Selector */}
                <Select value={hour} onValueChange={handleHourChange}>
                    <SelectTrigger className="flex-1 border-none rounded-none focus:ring-0">
                        <SelectValue placeholder="hh" />
                    </SelectTrigger>
                    <SelectContent className="border-[#ededed] py-3 text-black">
                        {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem
                                key={i}
                                value={String(i + 1).padStart(2, "0")}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Minute Selector */}
                <Select value={minute} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="flex-1 border-none rounded-none focus:ring-0">
                        <SelectValue placeholder="mm" />
                    </SelectTrigger>
                    <SelectContent className="border-[#ededed] py-3 text-black">
                        {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                {String(i).padStart(2, "0")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* AM/PM Selector */}
                <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="flex-1 border-none rounded-none focus:ring-0">
                        <SelectValue placeholder="aa" />
                    </SelectTrigger>
                    <SelectContent className="border-[#ededed] py-3 text-black">
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default TimePicker;
