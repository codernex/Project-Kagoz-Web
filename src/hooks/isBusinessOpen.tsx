import { useState, useEffect, useRef } from "react";

export function useBusinessOpen(openingHours: OpeningHour[] | undefined) {
    const [isOpen, setIsOpen] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Helper function to check if business is open
        const checkIfOpen = () => {
            const now = new Date();
            const currentDay = now.toLocaleString("en-US", { weekday: "long" });
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            // Convert 12-hour time to 24-hour
            const to24Hour = (hour: number, period: string): number => {
                if (period === "PM" && hour !== 12) return hour + 12;
                if (period === "AM" && hour === 12) return 0;
                return hour;
            };

            // Find today's opening hours
            const todayOpeningHour = openingHours?.find(
                (hour) => hour.day === currentDay
            );

            if (!todayOpeningHour || !todayOpeningHour.isOpen) {
                // Business is closed if no hours exist for today or isOpen is false
                return false;
            }

            // Check if current time is within any time range
            return todayOpeningHour.timeRanges.some((range) => {
                const fromHour24 = to24Hour(parseInt(range.fromHours), range.fromPeriod);
                const toHour24 = to24Hour(parseInt(range.toHours), range.toPeriod);

                const fromMinutesTotal = fromHour24 * 60 + parseInt(range.fromMinutes);
                const toMinutesTotal = toHour24 * 60 + parseInt(range.toMinutes);
                const currentMinutesTotal = currentHours * 60 + currentMinutes;

                return (
                    currentMinutesTotal >= fromMinutesTotal &&
                    currentMinutesTotal < toMinutesTotal
                );
            });
        };

        // Initial check
        setIsOpen(checkIfOpen());

        // Set interval to check every 5 minutes
        intervalRef.current = setInterval(() => {
            setIsOpen(checkIfOpen());
        }, 300000); // 300,000ms = 5 minutes

        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [openingHours]);

    return isOpen;
}

