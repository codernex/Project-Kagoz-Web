"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {  Copy, X, Clock } from "lucide-react"

import { useSetOpeningHoursMutation } from "@/redux/api/business"
import { useParams } from "next/navigation"

const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const dayAbbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Generate time options from 12:00 AM to 11:59 PM
const generateTimeOptions = () => {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      const timeString = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      times.push(timeString)
    }
  }
  return times
}

const timeOptions = generateTimeOptions()

// Transform form data to API format
const transformToApiFormat = (formData: BusinessHoursData) => {
  if (formData.is24Hours) {
    // If 24/7, send only isOpen247
    return {
      isOpen247: true
    }
  } else {
    // If not 24/7, send detailed days structure in the format expected by API
    const daysArray: any[] = []
    
    Object.entries(formData.businessHours).forEach(([day, schedule]) => {
      if (schedule.isOpen) {
        const timeRanges = schedule.slots.map(slot => {
          // Convert display format (9:00 AM) to API format (fromHours, fromMinutes, fromPeriod)
          const parseTime = (timeStr: string) => {
            const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
            if (!match) return { hours: "12", minutes: "00", period: "AM" }
            
            return {
              hours: match[1] || "12",
              minutes: match[2] || "00",
              period: (match[3] || "AM").toUpperCase()
            }
          }
          
          const startTime = parseTime(slot.start)
          const endTime = parseTime(slot.end)
          
          return {
            fromHours: startTime.hours,
            fromMinutes: startTime.minutes,
            fromPeriod: startTime.period,
            toHours: endTime.hours,
            toMinutes: endTime.minutes,
            toPeriod: endTime.period
          }
        })
        
        daysArray.push({
          day: day,
          isOpen: true,
          timeRanges: timeRanges
        })
      } else {
        daysArray.push({
          day: day,
          isOpen: false,
          timeRanges: []
        })
      }
    })
    
    return {
      isOpen247: false,
      days: daysArray
    }
  }
}

// Transform API data to form format
const transformFromApiFormat = (apiData: any, daysList: string[]): BusinessHoursData => {
  if (apiData?.isOpen247) {
    // If 24/7, set all days as open with default hours
    const businessHours: Record<string, DaySchedule> = {}
    daysList.forEach(day => {
      businessHours[day] = {
        isOpen: true,
        slots: [{ start: "9:00 AM", end: "6:00 PM" }]
      }
    })
    
    return {
      is24Hours: true,
      closedOnHolidays: false,
      businessHours: businessHours
    }
  } else if (Array.isArray(apiData)) {
    // Handle openingHours array format from API
    const businessHours: Record<string, DaySchedule> = {}
    
    // Initialize all days as closed first
    daysList.forEach(day => {
      businessHours[day] = {
        isOpen: false,
        slots: [{ start: "9:00 AM", end: "6:00 PM" }]
      }
    })
    
    // Process each day from API data
    apiData.forEach((dayData: any) => {
      const dayName = dayData.day
      if (dayData.isOpen && dayData.timeRanges?.length > 0) {
        const slots = dayData.timeRanges.map((range: any) => {
          // Convert API format (fromHours, fromMinutes, fromPeriod) to display format
          const formatTime = (hours: string, minutes: string, period: string) => {
            const h = hours.padStart(2, '0')
            const m = minutes.padStart(2, '0')
            return `${h}:${m} ${period}`
          }
          
          return {
            start: formatTime(range.fromHours, range.fromMinutes, range.fromPeriod),
            end: formatTime(range.toHours, range.toMinutes, range.toPeriod)
          }
        })
        
        businessHours[dayName] = {
          isOpen: true,
          slots: slots
        }
      } else {
        businessHours[dayName] = {
          isOpen: false,
          slots: [{ start: "9:00 AM", end: "6:00 PM" }]
        }
      }
    })
    
    return {
      is24Hours: false,
      closedOnHolidays: false,
      businessHours: businessHours
    }
  } else if (apiData?.days) {
    // If detailed days structure, parse it
    const businessHours: Record<string, DaySchedule> = {}
    
    apiData.days.forEach((dayData: any) => {
      const dayName = dayData.day
      if (dayData.isOpen && dayData.timeRanges?.length > 0) {
        const slots = dayData.timeRanges.map((range: any) => ({
          start: range.from,
          end: range.to
        }))
        businessHours[dayName] = {
          isOpen: true,
          slots: slots
        }
      } else {
        businessHours[dayName] = {
          isOpen: false,
          slots: []
        }
      }
    })
    
    return {
      is24Hours: false,
      closedOnHolidays: false,
      businessHours: businessHours
    }
  }
  
  // Default fallback
  return {
    is24Hours: false,
    closedOnHolidays: false,
    businessHours: {}
  }
}

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  isOpen: boolean
  slots: TimeSlot[]
}

interface BusinessHoursData {
  is24Hours: boolean
  closedOnHolidays: boolean
  businessHours: Record<string, DaySchedule>
}

interface BusinessHoursStepProps {
  data: BusinessHoursData
  businessData?: any // Main business data from parent
  onUpdate: (data: BusinessHoursData) => void
  onNext: () => void
  onBack: () => void
}

export default function BusinessHoursStep({ data, businessData, onUpdate, onNext, onBack }: BusinessHoursStepProps) {
  const [formData, setFormData] = useState<BusinessHoursData>(data)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [setOpeningHours] = useSetOpeningHoursMutation()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  const hasLoadedData = useRef(false)
  
  // Get opening hours from main business data
  const existingHours = businessData?.openingHours || businessData?.businessHours
  
  console.log("🚀 Business Data from main API:", businessData)
  console.log("🚀 Opening Hours from business data:", existingHours)

  // Load existing business hours from main business data
  useEffect(() => {
    if (existingHours && existingHours.length > 0) {
      console.log("📋 Loading existing business hours from main business data")
      const apiData = transformFromApiFormat(existingHours, days)
      console.log("📋 Transformed business data to form format:", apiData)
      setFormData(apiData)
      onUpdate(apiData)
    } else if (businessData && !existingHours) {
      // If business data exists but no opening hours, use default
      console.log("📋 No opening hours found, using default values")
      const initializedData = { ...formData }
      let needsUpdate = false

      days.forEach(day => {
        if (!initializedData.businessHours[day]) {
          initializedData.businessHours[day] = {
            isOpen: day !== "Friday", // Default: closed on Friday
            slots: [{ start: "9:00 AM", end: "6:00 PM" }]
          }
          needsUpdate = true
        }
      })

      if (needsUpdate) {
        setFormData(initializedData)
        onUpdate(initializedData)
      }
    }
  }, [businessData, existingHours]) // Removed onUpdate from dependencies

  const validateTimeSlot = (start: string, end: string): boolean => {
    const startTime = new Date(`2000-01-01 ${start}`)
    const endTime = new Date(`2000-01-01 ${end}`)
    return endTime > startTime
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {}
    let isValid = true

    // Check if at least one day is selected
    const hasOpenDays = days.some(day => formData.businessHours[day]?.isOpen)
    if (!hasOpenDays && !formData.is24Hours) {
      newErrors.general = ["Please select at least one day or enable 24/7 mode"]
      isValid = false
    }

    // Validate time slots for each day
    days.forEach(day => {
      if (formData.businessHours[day]?.isOpen) {
        const dayErrors: string[] = []
        formData.businessHours[day].slots.forEach((slot, index) => {
          if (!validateTimeSlot(slot.start, slot.end)) {
            dayErrors.push(`Time slot ${index + 1}: End time must be after start time`)
            isValid = false
          }
        })
        if (dayErrors.length > 0) {
          newErrors[day] = dayErrors
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleToggleDay = (day: string) => {
    const currentDay = formData.businessHours[day];
    if (!currentDay) return;
    const updatedHours: Record<string, DaySchedule> = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        isOpen: !currentDay.isOpen,
        slots: !currentDay.isOpen ? [{ start: "9:00 AM", end: "6:00 PM" }] : currentDay.slots
      },
    };
    const newData: BusinessHoursData = { ...formData, businessHours: updatedHours };
    setFormData(newData);
    onUpdate(newData);
    // Clear errors for this day
    if (errors[day]) {
      const newErrors = { ...errors };
      delete newErrors[day];
      setErrors(newErrors);
    }
  }

  const addTimeSlot = (day: string) => {
    const currentDay = formData.businessHours[day];
    if (!currentDay) return;
    const updatedHours: Record<string, DaySchedule> = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        slots: [...currentDay.slots, { start: "9:00 AM", end: "6:00 PM" }],
      },
    };
    const newData: BusinessHoursData = { ...formData, businessHours: updatedHours };
    setFormData(newData);
    onUpdate(newData);
  }

  const removeTimeSlot = (day: string, index: number) => {
    const currentDay = formData.businessHours[day];
    if (!currentDay || currentDay.slots.length <= 1) return; // Don't remove the last slot
    const updatedHours: Record<string, DaySchedule> = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        slots: currentDay.slots.filter((_, i) => i !== index),
      },
    };
    const newData: BusinessHoursData = { ...formData, businessHours: updatedHours };
    setFormData(newData);
    onUpdate(newData);
  }

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const currentDay = formData.businessHours[day];
    if (!currentDay) return;
    const updatedSlots = [...currentDay.slots];
    const prevSlot = updatedSlots[index] || { start: '', end: '' };
    updatedSlots[index] = {
      start: field === 'start' ? value : prevSlot.start || '',
      end: field === 'end' ? value : prevSlot.end || '',
    };
    const updatedHours: Record<string, DaySchedule> = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        slots: updatedSlots,
      },
    };
    const newData: BusinessHoursData = { ...formData, businessHours: updatedHours };
    setFormData(newData);
    onUpdate(newData);
    // Clear errors for this day when user makes changes
    if (errors[day]) {
      const newErrors = { ...errors };
      delete newErrors[day];
      setErrors(newErrors);
    }
  }

  const copyMonFriHours = () => {
    const mondayHours = formData.businessHours["Monday"];
    if (!mondayHours || !mondayHours.isOpen) {
      alert("Please set Monday hours first before copying");
      return;
    }
    const updatedHours: Record<string, DaySchedule> = {
      ...formData.businessHours,
      "Tuesday": { ...mondayHours },
      "Wednesday": { ...mondayHours },
      "Thursday": { ...mondayHours },
      "Friday": { ...mondayHours },
    };
    const newData: BusinessHoursData = { ...formData, businessHours: updatedHours };
    setFormData(newData);
    onUpdate(newData);
  }

  const handleToggle24Hours = (checked: boolean) => {
    const newData: BusinessHoursData = { 
      ...formData, 
      is24Hours: checked,
      // When 24/7 is enabled, disable holidays toggle
      closedOnHolidays: checked ? false : formData.closedOnHolidays
    };
    setFormData(newData);
    onUpdate(newData);
    // Clear general errors when toggling 24/7
    if (errors.general) {
      const newErrors = { ...errors };
      delete newErrors.general;
      setErrors(newErrors);
    }
  }

  const handleToggleHolidays = (checked: boolean) => {
    // Don't allow holidays toggle when 24/7 is enabled
    if (formData.is24Hours) return;
    
    const newData: BusinessHoursData = { ...formData, closedOnHolidays: checked };
    setFormData(newData);
    onUpdate(newData);
  }

  const handleNext = async () => {
    if (!validateForm()) return
    try {
      // Transform data to match API structure
      const payload = transformToApiFormat(formData)
      console.log("🚀 Business Hours API Payload:", payload)
      await setOpeningHours({ slug, ...payload }).unwrap()
      onNext()
    } catch (e) {
      console.error("Failed to save opening hours", e)
    }
  }

  const handleSaveAndBack = async () => {
    if (!validateForm()) return
    try {
      // Transform data to match API structure
      const payload = transformToApiFormat(formData)
      console.log("🚀 Business Hours API Payload:", payload)
      await setOpeningHours({ slug, ...payload }).unwrap()
      onBack()
    } catch (e) {
      console.error("Failed to save opening hours", e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
    
          <Clock className="size-6 text-[#9333EA]" />
     
        <h3 className="auth-heading !font-medium text-[#111827]">Business Hours & Availability</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">When are you open?</p>

{/* Day Selection - Only show if not 24/7 */}
{!formData.is24Hours && (
        <div>
          <Label className="text-sm font-medium">Days Open </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {dayAbbr.map((day, idx) => (
              <button
                key={day}
                className={`px-[53px] py-[13px] rounded ${
                  days[idx] !== undefined && formData.businessHours[days[idx]]?.isOpen
                    ? "border-[#9333EA] border hover:bg-[#F1EBFF] bg-[#F1EBFF] text-[#9333EA]"
                    : "text-[#2D3643] bg-white border-[#E4E4E4] border hover:bg-[#F1EBFF]"
                }`}
                onClick={() => { if (days[idx] !== undefined) handleToggleDay(days[idx]) }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* General Errors */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          {errors.general.map((error, index) => (
            <p key={index} className="text-red-600 text-sm">{error}</p>
          ))}
        </div>
      )}
<Label>Optional Toggles:</Label>
      <div className="flex flex-col gap-5">
        {/* <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <Label htmlFor="24-7" className="text-sm font-medium">24/7 Open</Label>
        </div> */}
        <div className="flex gap-[11.5px]">

        <Switch
          id="24-7"
          checked={formData.is24Hours}
          onCheckedChange={handleToggle24Hours}
        />
        <h2 className="text-sm font-normal">24/7 Open</h2>
        </div>
         <div className="flex gap-[11.5px]">
         <Switch
            id="holidays"
            checked={formData.closedOnHolidays}
            onCheckedChange={handleToggleHolidays}
            disabled={formData.is24Hours}
          />
        <h2 className={`text-sm font-normal ${formData.is24Hours ? 'text-gray-400' : ''}`}>Closed on Public Holidays</h2>
         </div>
      </div>

      

      {/* Optional Toggles */}
      <div className="space-y-3">
      
        
        {!formData.is24Hours && (
          <button
            onClick={copyMonFriHours}
           
            className="flex items-center gap-2 bg-[#F3F4F6] p-2 text-[#2D3643] border-purple-200 rounded-[8px]"
          >
            <Copy className="w-3 h-3" />
            Copy Mon-Fri hours to all weekdays
          </button>
        )}
      </div>

      {/* Opening Hours - Only show if not 24/7 */}
      {!formData.is24Hours && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Opening Hours</Label>
          <div className="space-y-4">
            {days.map((day) => (
              formData.businessHours[day] && formData.businessHours[day].isOpen && (
                <div key={day} className="border-gray-200 border rounded-[8px]">
                  <div className="p-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-900">{day}:</Label>
                      
                      {/* Day-specific errors */}
                      {errors[day] && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-2">
                          {errors[day].map((error, index) => (
                            <p key={index} className="text-red-600 text-xs">{error}</p>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {formData.businessHours[day]!.slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-[12px] text-[#353535] mb-3">
                            <span className="text-gray-500">Time Slot {idx + 1}:</span>
                            {/* Start Time Selector */}
                            <Select
                              value={slot.start || ''}
                              onValueChange={(v) => updateTimeSlot(day, idx, 'start', v)}
                            >
                              <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t} className="text-[#353535]">
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-gray-500">→</span>
                            {/* End Time Selector */}
                            <Select
                              value={slot.end || ''}
                              onValueChange={(v) => updateTimeSlot(day, idx, 'end', v)}
                            >
                              <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t} className="text-[#353535]">
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formData.businessHours[day]!.slots.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(day, idx)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-[16px] h-[16px]" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <button
                         
                          className="text-[#6F00FF] cursor-pointer p-0 h-auto"
                          onClick={() => addTimeSlot(day)}
                        >
                          + Add Another Time Slot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
        <button
         
          onClick={handleSaveAndBack}
          className="!px-20 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987]  rounded-lg"
        >
          Save & Back to Businesses
        </button>
        <button
          onClick={handleNext}
          className="!px-20 !py-3 cursor-pointer bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
