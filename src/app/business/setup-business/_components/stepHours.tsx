"use client"

import type { BusinessData } from "./businessSetup"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Copy, X } from "lucide-react"
import { JSX, useState, useEffect } from "react"

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
  renderBusinessPreview: () => JSX.Element
}

export function StepHours({ businessData, updateBusinessData, renderBusinessPreview }: StepProps) {
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
              startTime: dayData?.openTime || "9:00 AM",
              endTime: dayData?.closeTime || "6:00 PM"
            }
          ]
        };
      });
      return hydrated;
    }
    // Default fallback
    const hours: { [key: string]: DayHours } = {};
    DAYS.forEach(day => {
      hours[day] = {
        isOpen: false,
        timeSlots: [{
          id: `${day}-1`,
          startTime: "9:00 AM",
          endTime: "6:00 PM"
        }]
      };
    });
    return hours;
  });

  useEffect(() => {
    if (businessData.closedOnHolidays && !businessData.is24x7) {
      const newHours: { [key: string]: DayHours } = { ...businessHours };
      DAYS.forEach(day => {
        newHours[day] = {
          isOpen: day !== "Fri",
          timeSlots: [
            {
              id: `${day}-1`,
              startTime: "9:00 AM",
              endTime: "6:00 PM"
            }
          ]
        };
      });
      newHours.Mon = {
        isOpen: true,
        timeSlots: [
          {
            id: "Mon-1",
            startTime: "9:00 AM",
            endTime: "1:00 PM"
          },
          {
            id: "Mon-2",
            startTime: "2:00 PM",
            endTime: "6:00 PM"
          }
        ]
      };
      setBusinessHours(newHours);
      updateHours(newHours);
    }
  }, [businessData.closedOnHolidays, businessData.is24x7]);

  const updateHours = (newHours: { [key: string]: DayHours }) => {
    setBusinessHours(newHours);
    const formattedHours: { [key: string]: { isOpen: boolean; openTime: string; closeTime: string } } = {};
    Object.entries(newHours).forEach(([day, hours]) => {
      // If there are multiple timeSlots, only take the first for open/close
      formattedHours[day] = {
        isOpen: hours?.isOpen ?? false,
        openTime: hours?.timeSlots?.[0]?.startTime ?? "9:00 AM",
        closeTime: hours?.timeSlots?.[0]?.endTime ?? "6:00 PM"
      };
    });
    updateBusinessData("businessHours", formattedHours);
  };

  const toggleDay = (day: string) => {
    const newHours = { ...businessHours }
    if (newHours[day]) {
      newHours[day]!.isOpen = !newHours[day]!.isOpen
      updateHours(newHours)
    }
  }

  const addTimeSlot = (day: string) => {
    const newHours = { ...businessHours }
    if (!newHours[day]) return;
    if (!Array.isArray(newHours[day]?.timeSlots)) newHours[day]!.timeSlots = [];
    const slotCount = (newHours[day]?.timeSlots?.length ?? 0) + 1;
    newHours[day]!.timeSlots.push({
      id: `${day}-${slotCount}`,
      startTime: "9:00 AM",
      endTime: "6:00 PM"
    });
    updateHours(newHours);
  }

  const removeTimeSlot = (day: string, slotId: string) => {
    const newHours = { ...businessHours }
    if (Array.isArray(newHours[day]?.timeSlots)) {
      newHours[day]!.timeSlots = newHours[day]!.timeSlots.filter(slot => slot.id !== slotId)
    }
    updateHours(newHours)
  }

  const updateTimeSlot = (day: string, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    const newHours = { ...businessHours }
    const slot = newHours[day]?.timeSlots?.find(s => s.id === slotId)
    if (slot) {
      slot[field] = value
      updateHours(newHours)
    }
  }

  const copyMonFriHours = () => {
    const newHours = { ...businessHours }
    const monFriSlots = newHours.Mon?.timeSlots ?? [];
    DAYS.slice(0, 5).forEach((day) => {
      if (newHours[day]) {
        newHours[day]!.timeSlots = monFriSlots.map((slot: TimeSlot) => {
          const parts = slot.id.split('-')
          const slotNumber = parts.length > 1 ? parts[1] : '1'
          return {
            ...slot,
            id: `${day}-${slotNumber}`
          }
        })
      }
    })
    updateHours(newHours)
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date()
        time.setHours(hour, minute, 0, 0)
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        options.push(timeString)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()
  const hasSelectedDays = Object.values(businessHours).some((day: DayHours) => day.isOpen)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:p-1 p-2">
      <div className="lg:col-span-2">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="size-6 text-[#6F00FF]" />
          <h2 className="auth-heading !font-medium text-[#111827]">Business Hours & Availability</h2>
        </div>
        <p className="text-[#2D3643] mb-6">When are you open?</p>

        {/* Day Selection Buttons */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {DAYS.slice(0, 4).map((day) => (
              <Button
                key={day}
                variant={businessHours[day]?.isOpen ? "default" : "outline"}
                onClick={() => toggleDay(day)}
                className={`h-10 ${
                  businessHours[day]?.isOpen 
                    ? "bg-[#6F00FF] text-white border-[#6F00FF]" 
                    : "bg-white text-[#6F00FF] border-[#6F00FF] hover:bg-[#6F00FF] hover:text-white"
                }`}
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DAYS.slice(4).map((day) => (
              <Button
                key={day}
                variant={businessHours[day]?.isOpen ? "default" : "outline"}
                onClick={() => toggleDay(day)}
                className={`h-10 ${
                  businessHours[day]?.isOpen 
                    ? "bg-[#6F00FF] text-white border-[#6F00FF]" 
                    : "bg-white text-[#6F00FF] border-[#6F00FF] hover:bg-[#6F00FF] hover:text-white"
                }`}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        {/* Optional Toggles Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Optional Toggles</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">24/7 Open</Label>
              <Switch
                checked={businessData.is24x7}
                onCheckedChange={(checked) => updateBusinessData("is24x7", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">Closed on Public Holidays</Label>
              <Switch
                checked={businessData.closedOnHolidays}
                onCheckedChange={(checked) => updateBusinessData("closedOnHolidays", checked)}
              />
            </div>
            
            <Button
              variant="outline"
              onClick={copyMonFriHours}
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Mon-Fri hours to all weekdays</span>
            </Button>
          </div>
        </div>

        {/* Opening Hours Section */}
        {!businessData.is24x7 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">{DAY_NAMES[day as keyof typeof DAY_NAMES]}</h3>
                  
                  {businessHours[day]?.timeSlots?.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-3 mb-3">
                      <Select
                        value={slot.startTime}
                        onValueChange={(value) => updateTimeSlot(day, slot.id, 'startTime', value)}
                      >
                        <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <span className="text-gray-500">to</span>
                      
                      <Select
                        value={slot.endTime}
                        onValueChange={(value) => updateTimeSlot(day, slot.id, 'endTime', value)}
                      >
                        <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
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
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                    className="text-[#6F00FF] hover:text-purple-700 text-sm font-medium p-0 h-auto"
                  >
                    + Add Another Time Slot
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div>
        <div className="sticky top-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-[#6F00FF] rounded-full"></div>
            <h3 className="font-semibold">Hours Preview</h3>
          </div>
          {renderBusinessPreview()}
        </div>
      </div>
    </div>
  )
}

