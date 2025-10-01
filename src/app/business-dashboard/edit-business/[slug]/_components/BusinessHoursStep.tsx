"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, X, Clock } from "lucide-react"
import { useSetOpeningHoursMutation } from "@/redux/api/business"
import { useParams } from "next/navigation"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const dayAbbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const generateTimeOptions = () => {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      times.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }
  }
  return times
}

const timeOptions = generateTimeOptions()

const transformToApiFormat = (formData: BusinessHoursData) => {
  if (formData.is24Hours || formData.closedOnHolidays) {
    return { isOpen247: true }
  }

  const openDaysArray = Object.entries(formData.businessHours)
    .filter(([_, schedule]) => schedule.isOpen && schedule.slots?.length)
    .map(([day, schedule]) => ({
      day,
      isOpen: true,
      timeRanges: schedule.slots.map(slot => {
        const parseTime = (timeStr: string) => {
          const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
          return match ? { hours: match[1], minutes: match[2], period: (match[3] || "AM").toUpperCase() } : { hours: "12", minutes: "00", period: "AM" }
        }
        const startTime = parseTime(slot.start || "9:00 AM")
        const endTime = parseTime(slot.end || "6:00 PM")
        return { from: startTime, to: endTime }
      })
    }))

  return openDaysArray.length ? { isOpen247: false, days: openDaysArray } : {}
}

const transformFromApiFormat = (apiData: any, daysList: string[]): BusinessHoursData => {
  if (apiData?.isOpen247) {
    const businessHours = Object.fromEntries(
      daysList.map(day => [day, { isOpen: true, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }])
    )
    return { is24Hours: true, closedOnHolidays: false, businessHours }
  }

  const businessHours = Object.fromEntries(
    daysList.map(day => [day, { isOpen: false, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }])
  )

  if (Array.isArray(apiData)) {
    apiData.forEach((dayData: any) => {
      const dayName = dayData.day
      if (dayName && businessHours[dayName]) {
        businessHours[dayName] = dayData.isOpen && dayData.timeRanges?.length
          ? {
              isOpen: true,
              slots: dayData.timeRanges.map((range: any) => ({
                start: `${(range.fromHours || "9").padStart(2, '0')}:${(range.fromMinutes || "00").padStart(2, '0')} ${range.fromPeriod || "AM"}`,
                end: `${(range.toHours || "9").padStart(2, '0')}:${(range.toMinutes || "00").padStart(2, '0')} ${range.toPeriod || "AM"}`
              }))
            }
          : { isOpen: false, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }
      }
    })
  } else if (apiData?.days) {
    apiData.days.forEach((dayData: any) => {
      if (dayData.day && businessHours[dayData.day]) {
        businessHours[dayData.day] = dayData.isOpen && dayData.timeRanges?.length
          ? { 
              isOpen: true, 
              slots: dayData.timeRanges.map((range: any) => ({ 
                start: range.from || "9:00 AM", 
                end: range.to || "6:00 PM" 
              })) 
            }
          : { isOpen: false, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }
      }
    })
  }

  return { is24Hours: false, closedOnHolidays: false, businessHours }
}

interface TimeSlot { start: string; end: string }
interface DaySchedule { isOpen: boolean; slots: TimeSlot[] }
interface BusinessHoursData { is24Hours: boolean; closedOnHolidays: boolean; businessHours: Record<string, DaySchedule> }
interface BusinessHoursStepProps { data: BusinessHoursData; businessData?: any; onUpdate: (data: BusinessHoursData) => void; onNext: () => void; onBack: () => void }

export default function BusinessHoursStep({ data, businessData, onUpdate, onNext, onBack }: BusinessHoursStepProps) {
  const [formData, setFormData] = useState<BusinessHoursData>(data)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [setOpeningHours] = useSetOpeningHoursMutation()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  const hasLoadedData = useRef(false)
  const existingHours = businessData?.openingHours || businessData?.businessHours
  const hasExistingData = existingHours && existingHours.length > 0

  useEffect(() => {
    if (hasExistingData && !hasLoadedData.current) {
      hasLoadedData.current = true
      const apiData = transformFromApiFormat(existingHours, days)
      setFormData(apiData)
      onUpdate(apiData)
    } else if (!hasExistingData) {
      const initializedData = {
        ...formData,
        closedOnHolidays: true,
        is24Hours: false,
        businessHours: Object.fromEntries(
          days.map(day => [day, {
            isOpen: day !== "Friday",
            slots: [{ start: "9:00 AM", end: "6:00 PM" }]
          }])
        )
      }
      setFormData(initializedData)
      onUpdate(initializedData)
    }
  }, [businessData, existingHours, hasExistingData])

  const validateTimeSlot = (start: string, end: string): boolean => {
    const startTime = new Date(`2000-01-01 ${start}`)
    const endTime = new Date(`2000-01-01 ${end}`)
    return endTime > startTime
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {}
    let isValid = true

    const hasOpenDays = days.some(day => formData.businessHours[day]?.isOpen)
    if (!hasOpenDays && !formData.is24Hours && !formData.closedOnHolidays) {
      newErrors.general = ["Please select at least one day, enable 24/7 mode, or enable closed on public holidays"]
      isValid = false
    }

    days.forEach(day => {
      if (formData.businessHours[day]?.isOpen) {
        const dayErrors: string[] = []
        formData.businessHours[day].slots.forEach((slot, index) => {
          if (!validateTimeSlot(slot.start, slot.end)) {
            dayErrors.push(`Time slot ${index + 1}: End time must be after start time`)
            isValid = false
          }
        })
        if (dayErrors.length) newErrors[day] = dayErrors
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleToggleDay = (day: string) => {
    const currentDay = formData.businessHours[day]
    if (!currentDay) return
    
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        isOpen: !currentDay.isOpen,
        slots: currentDay.isOpen ? currentDay.slots : [{ start: "9:00 AM", end: "6:00 PM" }]
      }
    }
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
    if (errors[day]) setErrors(prev => {
  const newErrors = { ...prev }
  delete newErrors[day]
  return newErrors
})
  }

  const addTimeSlot = (day: string) => {
    const currentDay = formData.businessHours[day]
    if (!currentDay) return
    
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        slots: [...currentDay.slots, { start: "9:00 AM", end: "6:00 PM" }]
      }
    }
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const removeTimeSlot = (day: string, index: number) => {
    const currentDay = formData.businessHours[day]
    if (!currentDay || currentDay.slots.length <= 1) return
    
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...currentDay,
        slots: currentDay.slots.filter((_, i) => i !== index)
      }
    }
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const currentDay = formData.businessHours[day]
    if (!currentDay) return
    
    const updatedSlots = [...currentDay.slots]
    const currentSlot = updatedSlots[index]
    if (currentSlot) {
      updatedSlots[index] = { ...currentSlot, [field]: value }
    }
    const updatedHours = {
      ...formData.businessHours,
      [day]: { ...currentDay, slots: updatedSlots }
    }
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
    if (errors[day]) setErrors(prev => {
  const newErrors = { ...prev }
  delete newErrors[day]
  return newErrors
})
  }

  const copyMonFriHours = () => {
    const mondayHours = formData.businessHours["Monday"]
    if (!mondayHours || !mondayHours.isOpen) {
      alert("Please set Monday hours first before copying")
      return
    }
    const updatedHours = {
      ...formData.businessHours,
      Tuesday: { ...mondayHours },
      Wednesday: { ...mondayHours },
      Thursday: { ...mondayHours },
      Friday: { ...mondayHours }
    }
    const newData = { ...formData, businessHours: updatedHours }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleToggle24Hours = (checked: boolean) => {
    const newData = { ...formData, is24Hours: checked, closedOnHolidays: checked ? false : formData.closedOnHolidays }
    setFormData(newData)
    onUpdate(newData)
    if (errors.general) setErrors(prev => {
  const newErrors = { ...prev }
  delete newErrors.general
  return newErrors
})
  }

  const handleToggleHolidays = (checked: boolean) => {
    if (formData.is24Hours) return
    const newData = { ...formData, closedOnHolidays: checked }
    setFormData(newData)
    onUpdate(newData)
    if (errors.general) setErrors(prev => {
  const newErrors = { ...prev }
  delete newErrors.general
  return newErrors
})
  }

  const handleNext = async () => {
    if (!validateForm()) return
    try {
      const payload = transformToApiFormat(formData)
      await setOpeningHours({ slug, ...payload }).unwrap()
      onNext()
    } catch (e) {}
  }

  const handleSaveAndBack = async () => {
    if (!validateForm()) return
    try {
      const payload = transformToApiFormat(formData)
      await setOpeningHours({ slug, ...payload }).unwrap()
      onBack()
    } catch (e) {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="size-6 text-[#9333EA]" />
        <h3 className="auth-heading !font-medium text-[#111827]">Business Hours & Availability</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">When are you open?</p>

      <div className="space-y-6">
        {!formData.is24Hours && (
          <div>
            <Label className="text-sm font-medium">Days Open</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {dayAbbr.map((day, idx) => {
                const dayName = days[idx]
                if (!dayName) return null
                return (
                <button
                  key={day}
                  className={`px-[53px] py-[13px] rounded ${
                    formData.businessHours[dayName]?.isOpen
                      ? "border-[#9333EA] border hover:bg-[#F1EBFF] bg-[#F1EBFF] text-[#9333EA]"
                      : "text-[#2D3643] bg-white border-[#E4E4E4] border hover:bg-[#F1EBFF]"
                  }`}
                  onClick={() => handleToggleDay(dayName)}
                >
                  {day}
                </button>
                )
              })}
            </div>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            {errors.general.map((error, index) => (
              <p key={index} className="text-red-600 text-sm">{error}</p>
            ))}
          </div>
        )}

        <Label>Optional Toggles:</Label>
        <div className="flex flex-col gap-5">
          <div className="flex gap-[11.5px]">
            <Switch id="24-7" checked={formData.is24Hours} onCheckedChange={handleToggle24Hours} />
            <h2 className="text-sm font-normal">24/7 Open</h2>
          </div>
          <div className="flex gap-[11.5px]">
            <Switch id="holidays" checked={formData.closedOnHolidays} onCheckedChange={handleToggleHolidays} disabled={formData.is24Hours} />
            <h2 className={`text-sm font-normal ${formData.is24Hours ? 'text-gray-400' : ''}`}>Closed on Public Holidays</h2>
          </div>
        </div>

        {!formData.is24Hours && (
          <button
            onClick={copyMonFriHours}
            className="flex items-center gap-2 bg-[#F3F4F6] p-2 text-[#2D3643] border-purple-200 rounded-[8px]"
          >
            <Copy className="w-3 h-3" />
            Copy Mon-Fri hours to all weekdays
          </button>
        )}

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
                        {errors[day] && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-2">
                            {errors[day].map((error, index) => (
                              <p key={index} className="text-red-600 text-xs">{error}</p>
                            ))}
                          </div>
                        )}
                        <div className="space-y-3">
                          {formData.businessHours[day].slots.map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-[12px] text-[#353535] mb-3">
                              <span className="text-gray-500">Time Slot {idx + 1}:</span>
                              <Select value={slot.start || ''} onValueChange={(v) => updateTimeSlot(day, idx, 'start', v)}>
                                <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                                  <SelectValue>{slot.start || 'Select start time'}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((t) => (
                                    <SelectItem key={t} value={t} className="text-[#353535]">{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-gray-500">→</span>
                              <Select value={slot.end || ''} onValueChange={(v) => updateTimeSlot(day, idx, 'end', v)}>
                                <SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]">
                                  <SelectValue>{slot.end || 'Select end time'}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((t) => (
                                    <SelectItem key={t} value={t} className="text-[#353535]">{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {formData.businessHours[day]?.slots && formData.businessHours[day].slots.length > 1 && (
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
                          <button className="text-[#6F00FF] cursor-pointer p-0 h-auto" onClick={() => addTimeSlot(day)}>
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
      </div>

      <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
        <button onClick={handleSaveAndBack} className="!px-20 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987] rounded-lg">
          Save & Back to Businesses
        </button>
        <button onClick={handleNext} className="!px-20 !py-3 cursor-pointer bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg">
          Save & Continue
        </button>
      </div>
    </div>
  )
}