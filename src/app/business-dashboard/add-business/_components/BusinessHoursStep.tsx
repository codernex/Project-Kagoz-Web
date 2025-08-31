"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Copy, X, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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
  onUpdate: (data: BusinessHoursData) => void
  onNext: () => void
  onBack: () => void
}

export default function BusinessHoursStep({ data, onUpdate, onNext, onBack }: BusinessHoursStepProps) {
  const [formData, setFormData] = useState<BusinessHoursData>(data)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Initialize business hours if not already set
  useEffect(() => {
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
  }, [])

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
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        isOpen: !formData.businessHours[day].isOpen,
        // Initialize with default slot if opening the day
        slots: !formData.businessHours[day].isOpen ? [{ start: "9:00 AM", end: "6:00 PM" }] : formData.businessHours[day].slots
      },
    }
    
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
    
    // Clear errors for this day
    if (errors[day]) {
      const newErrors = { ...errors }
      delete newErrors[day]
      setErrors(newErrors)
    }
  }

  const addTimeSlot = (day: string) => {
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        slots: [...formData.businessHours[day].slots, { start: "9:00 AM", end: "6:00 PM" }],
      },
    }
    
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const removeTimeSlot = (day: string, index: number) => {
    if (formData.businessHours[day].slots.length <= 1) return // Don't remove the last slot
    
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        slots: formData.businessHours[day].slots.filter((_, i) => i !== index),
      },
    }
    
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const updatedSlots = [...formData.businessHours[day].slots]
    updatedSlots[index] = { ...updatedSlots[index], [field]: value }
    
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        slots: updatedSlots,
      },
    }
    
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
    
    // Clear errors for this day when user makes changes
    if (errors[day]) {
      const newErrors = { ...errors }
      delete newErrors[day]
      setErrors(newErrors)
    }
  }

  const copyMonFriHours = () => {
    const mondayHours = formData.businessHours["Monday"]
    if (!mondayHours?.isOpen) {
      alert("Please set Monday hours first before copying")
      return
    }
    
    const updatedHours = {
      ...formData.businessHours,
      "Tuesday": { ...mondayHours },
      "Wednesday": { ...mondayHours },
      "Thursday": { ...mondayHours },
      "Friday": { ...mondayHours },
    }
    
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleToggle24Hours = (checked: boolean) => {
    const newData = { ...formData, is24Hours: checked }
    setFormData(newData)
    onUpdate(newData)
    
    // Clear general errors when toggling 24/7
    if (errors.general) {
      const newErrors = { ...errors }
      delete newErrors.general
      setErrors(newErrors)
    }
  }

  const handleToggleHolidays = (checked: boolean) => {
    const newData = { ...formData, closedOnHolidays: checked }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleSaveAndBack = () => {
    if (validateForm()) {
      onBack()
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
            {dayAbbr.map((day, index) => (
              <button
                key={day}
                className={`px-[53px] py-[13px] rounded ${
                  formData.businessHours[days[index]]?.isOpen
                    ? "border-[#9333EA] border hover:bg-[#F1EBFF] bg-[#F1EBFF] text-[#9333EA]"
                    : "text-[#2D3643] bg-white border-[#E4E4E4] border hover:bg-[#F1EBFF]"
                }`}
                onClick={() => handleToggleDay(days[index])}
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
          />
        <h2 className="text-sm font-normal">Closed on Public Holidays</h2>
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
              formData.businessHours[day]?.isOpen && (
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
                        {formData.businessHours[day].slots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3 p-3  ">
                            <span className="text-sm text-gray-600 w-20">Time Slot {index + 1}:</span>
                            
                            {/* Start Time Selector */}
                            <Select
                              label={undefined}
                              required={true}
                              placeholder="Start"
                              value={slot.start}
                              onValueChange={(v) => updateTimeSlot(day, index, 'start', v)}
                              width="w-32"
                            >
                              <SelectContent className="max-h-64">
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <ArrowRight className="size-4 text-[#2D3643]" />
                            {/* <span className="text-sm text-gray-500">to</span> */}
                            
                            {/* End Time Selector */}
                            <Select
                              label={undefined}
                              required={true}
                              placeholder="End"
                              value={slot.end}
                              onValueChange={(v) => updateTimeSlot(day, index, 'end', v)}
                              width="w-32"
                            >
                              <SelectContent className="max-h-64">
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formData.businessHours[day].slots.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeTimeSlot(day, index)}
                                className="p-1 h-auto text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
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
      <div className="flex gap-10 w-1/2 mx-auto">
        <button
         
          onClick={handleNext}
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
