"use client"

import type { BusinessData } from "./businessSetup"
import { BusinessPreview } from "./BusinessPreview"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Copy, X, Calendar, ChevronLeft } from "lucide-react"
import { JSX, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSetOpeningHoursMutation } from "@/redux/api"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_NAMES = {
  "Mon": "Monday",
  "Tue": "Tuesday", 
  "Wed": "Wednesday",
  "Thu": "Thursday",
  "Fri": "Friday",
  "Sat": "Saturday",
  "Sun": "Sunday"
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface DayHours {
  isOpen: boolean
  timeSlots: TimeSlot[]
}

interface StepProps {
  businessData: BusinessData
  updateBusinessData: (field: string, value: any) => void
  onPrev: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export function StepHours({ businessData, updateBusinessData, onPrev, onNext, isNextDisabled }: StepProps) {
  const { slug } = useParams() as { slug?: string }
  const [setOpeningHours, { isLoading }] = useSetOpeningHoursMutation()
  const [businessHours, setBusinessHours] = useState<{ [key: string]: DayHours }>(() => {
    // If businessData.businessHours exists, hydrate from it
    if (businessData.businessHours && typeof businessData.businessHours === 'object') {
      const hydrated: { [key: string]: DayHours } = {};
      DAYS.forEach(day => {
        const dayData = businessData.businessHours[day];
        hydrated[day] = {
          isOpen: dayData?.isOpen || false,
          timeSlots: [
            {
              id: `${day}-1`,
              startTime: dayData?.openTime || "12:00 AM",
              endTime: dayData?.closeTime || "12:00 PM"
            }
          ]
        };
      });
      return hydrated;
    }
    // Default fallback: all days open, slot 12:00 AM - 12:00 PM
    const hours: { [key: string]: DayHours } = {};
    DAYS.forEach(day => {
      hours[day] = {
        isOpen: true,
        timeSlots: [{
          id: `${day}-1`,
          startTime: "12:00 AM",
          endTime: "12:00 PM"
        }]
      };
    });
    return hours;
  });

  // Update business data when hours change
  const updateHours = (newHours: { [key: string]: DayHours }) => {
    setBusinessHours(newHours);
    const formattedHours: { [key: string]: { isOpen: boolean; openTime: string; closeTime: string } } = {};
    Object.entries(newHours).forEach(([day, hours]) => {
      if (hours?.timeSlots && hours.timeSlots.length > 0) {
        // For multiple time slots, combine them into a readable format
        const timeRanges = hours.timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
        formattedHours[day] = {
          isOpen: hours?.isOpen ?? false,
          openTime: timeRanges,
          closeTime: timeRanges // We'll use this field to store the full time range
        };
      } else {
        formattedHours[day] = {
          isOpen: hours?.isOpen ?? false,
          openTime: "9:00 AM",
          closeTime: "6:00 PM"
        };
      }
    });
    updateBusinessData("businessHours", formattedHours);
  };

  // Handle 24/7 toggle
  const handle24x7Toggle = (checked: boolean) => {
    updateBusinessData("is24x7", checked);
    if (checked) {
      // When 24/7 is enabled, set all days to open
      const newHours: { [key: string]: DayHours } = {};
      DAYS.forEach(day => {
        newHours[day] = {
          isOpen: true,
          timeSlots: [{ id: `${day}-1`, startTime: "12:00 AM", endTime: "11:59 PM" }]
        };
      });
      updateHours(newHours);
    }
  };

  // Handle public holidays toggle
  const handleHolidaysToggle = (checked: boolean) => {
    updateBusinessData("closedOnHolidays", checked);
  };

  // Toggle day open/closed
  const toggleDay = (day: string) => {
    const newHours = { ...businessHours };
    if (newHours[day]) {
      newHours[day]!.isOpen = !newHours[day]!.isOpen;
      updateHours(newHours);
    }
  };

  // Add time slot to a day
  const addTimeSlot = (day: string) => {
    const newHours = { ...businessHours };
    if (!newHours[day]) return;
    
    const slotCount = (newHours[day]?.timeSlots?.length ?? 0) + 1;
    newHours[day]!.timeSlots.push({
      id: `${day}-${slotCount}`,
      startTime: "9:00 AM",
      endTime: "6:00 PM"
    });
    updateHours(newHours);
  };

  // Remove time slot from a day
  const removeTimeSlot = (day: string, slotId: string) => {
    const newHours = { ...businessHours };
    if (newHours[day]?.timeSlots) {
      newHours[day]!.timeSlots = newHours[day]!.timeSlots.filter(slot => slot.id !== slotId);
      updateHours(newHours);
    }
  };

  // Update time slot
  const updateTimeSlot = (day: string, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    const newHours = { ...businessHours };
    const slot = newHours[day]?.timeSlots?.find(s => s.id === slotId);
    if (slot) {
      slot[field] = value;
      updateHours(newHours);
    }
  };

  // Copy Mon-Fri hours to all weekdays
  const copyMonFriHours = () => {
    const newHours = { ...businessHours };
    const monSlots = newHours.Mon?.timeSlots ?? [];
    
    DAYS.slice(0, 5).forEach((day) => {
      if (newHours[day]) {
        newHours[day]!.timeSlots = monSlots.map((slot: TimeSlot) => ({
          ...slot,
          id: `${day}-${slot.id.split('-')[1]}`
        }));
        newHours[day]!.isOpen = true;
      }
    });
    updateHours(newHours);
  };

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const hasSelectedDays = Object.values(businessHours || {}).some((day: DayHours) => !!day && day.isOpen === true);

  // Initialize business hours on component mount
  useEffect(() => {
    if (!businessData.businessHours || Object.keys(businessData.businessHours).length === 0) {
      updateHours(businessHours);
    }
  }, []);

  // Set default hours for Fri-Sun as closed when closedOnHolidays is enabled
  useEffect(() => {
    if (businessData.closedOnHolidays && !businessData.is24x7) {
      const newHours: { [key: string]: DayHours } = { ...businessHours };
      DAYS.forEach(day => {
        // Friday, Saturday, Sunday closed by default
        if (["Fri", "Sat", "Sun"].includes(day)) {
          newHours[day] = {
            isOpen: false,
            timeSlots: [{
              id: `${day}-1`,
              startTime: "12:00 AM",
              endTime: "12:00 PM"
            }]
          };
        } else {
          newHours[day] = {
            isOpen: true,
            timeSlots: [{
              id: `${day}-1`,
              startTime: "12:00 AM",
              endTime: "12:00 PM"
            }]
          };
        }
      });
      setBusinessHours(newHours);
      updateHours(newHours);
    }
  }, [businessData.closedOnHolidays, businessData.is24x7]);

  const parseTime = (t: string) => {
    const m = t?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) {
      return { hours: "12", minutes: "00", period: "AM" } as const;
    }
    const period = (m[3] || "AM").toUpperCase();
    return { hours: m[1] || "12", minutes: m[2] || "00", period } as const;
  };

  const handleNext = async () => {
    const targetSlug = slug || (businessData as any)?.slug;
    if (!targetSlug) {
      onNext();
      return;
    }

    let payload: any;
    if (businessData.is24x7) {
      payload = { isOpen247: true };
    } else {
      const days: any[] = [];
      DAYS.forEach((abbr) => {
        const conf = businessHours[abbr];
        if (!conf?.isOpen) return;
        const dayName = DAY_NAMES[abbr as keyof typeof DAY_NAMES];
        const timeRanges = (conf.timeSlots || []).map((slot) => ({
          from: parseTime(slot.startTime),
          to: parseTime(slot.endTime),
        }));
        days.push({ day: dayName, isOpen: true, timeRanges });
      });
      payload = { days };
    }

    try {
      await setOpeningHours({ slug: targetSlug, ...payload }).unwrap();
      onNext();
    } catch (_e) {
      // handled by rtk toast
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:p-1 p-2">
      {/* Left Panel - Form Input */}
      <div className="lg:col-span-2">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-6 h-6 text-[#6F00FF]" />
          <h2 className="auth-heading !font-medium text-[#111827]">Business Hours & Availability</h2>
        </div>
        <p className="text-[#2D3643] mb-6">When are you open?</p>

        {/* Days Open Section */}
        <div className="mb-8">
          <Label className="text-sm font-medium text-[#111827] mb-4 block">
            Days Open <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-4 gap-[10px] mb-4">
            {DAYS.map((day) => {
              const bothOff = !businessData.is24x7 && !businessData.closedOnHolidays;
              const isActive = businessHours[day]?.isOpen && !bothOff;
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`h-[40px] w-full rounded-[4px] border ${
                    isActive
                      ? "bg-[#F1EBFF] text-[#6F00FF] border-[#6F00FF]"
                      : "bg-white border-[#E4E4E4] text-[#2D3643] hover:bg-[#6F00FF] hover:text-white"
                  }`}
                  disabled={bothOff}
                >
                  {DAY_NAMES[day as keyof typeof DAY_NAMES]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Toggles Section */}
        <div className="mb-8">
          <h3 className="text-[14px] text-[#111827] font-medium mb-4">Optional Toggles</h3>
          
          <div className="space-y-4">
            <div className="flex items-center ">
              <Switch
                checked={businessData.is24x7}
                onCheckedChange={handle24x7Toggle}
              />
              <Label className="ml-[12px] text-[14px] text-[#353535] font-normal">24/7 Open</Label>
            </div>
            
            <div className="flex items-center ">
              <Switch
                checked={businessData.closedOnHolidays}
                onCheckedChange={handleHolidaysToggle}
              />
              <Label className="ml-[12px] text-[14px] text-[#353535] font-normal">Closed on Public Holidays</Label>
            </div>

            <div className="bg-[#F3F4F6] p-[8px] text-[#2D3643] text-[14px] rounded-[8px] gap-3 flex items-center w-fit">
              <Copy className="w-[16px] h-[16px]" />
              <span>Copy Mon-Fri hours to all weekdays</span>
            </div>
          </div>
        </div>

            {/* Only show slots if closedOnHolidays is ON and is24x7 is OFF */}
            {!businessData.is24x7 && businessData.closedOnHolidays && hasSelectedDays && (
              <div>
                <h3 className="text-[16px] text-[#111827] font-medium mb-4">Opening Hours</h3>
                <div className="space-y-4">
                  {DAYS.filter(day => businessHours[day]?.isOpen).map((day) => (
                    <div key={day} className="border border-gray-200 rounded-[8px] p-[16px]">
                      <h3 className="font-medium text-gray-900 mb-3">{DAY_NAMES[day as keyof typeof DAY_NAMES]}</h3>
                      {businessHours[day]?.timeSlots?.map((slot, index) => (
                        <div key={slot.id} className="flex items-center space-y-3 gap-[12px] text-[#353535] mb-3">
                          <span className="text-gray-500">Time Slot {index + 1}:</span>
                          <Select
                            value={slot.startTime}
                            onValueChange={(value) => updateTimeSlot(day, slot.id, 'startTime', value)}
                          >
                            <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time} className="text-[#353535]">
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-gray-500">→</span>
                          <Select
                            value={slot.endTime}
                            onValueChange={(value) => updateTimeSlot(day, slot.id, 'endTime', value)}
                          >
                            <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time} className="text-[#353535]">
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {(businessHours[day]?.timeSlots?.length ?? 0) > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(day, slot.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-[16px] h-[16px]" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <button
                        
                        onClick={() => addTimeSlot(day)}
                        className="text-[#6F00FF] flex justify-start items-start pt-[6px] !text-start text-[14px] font-medium h-auto"
                      >
                        + Add Another Time Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
               <div className="flex gap-4 py-[32px] w-full">
              <button
                onClick={onPrev}
                className="flex items-center space-x-2 bg-white border justify-center border-gray-300  text-gray-700 hover:bg-gray-50 rounded-[8px] w-1/3 !px-10 y-2"
              >
                <ChevronLeft /><span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!!isNextDisabled}
                aria-disabled={!!isNextDisabled}
                className={`flex items-center justify-center w-full rounded-[8px] px-6 py-[10px] transition-colors ${
                  isNextDisabled
                    ? "bg-[#CDD1D8] text-white cursor-not-allowed"
                    : "bg-[#6F00FF] text-white hover:bg-[#6F00FF]"
                }`}
              >
                <span>{isLoading ? "Saving..." : "Next"}</span>
              </button>
            </div>
      </div>

      {/* Right Panel - Preview */}
      <div>
        <div className="sticky top-6">
          
          <BusinessPreview businessData={businessData} stepIndex={2} />
        </div>
      </div>
     
    </div>
  )
}
export default StepHours;


