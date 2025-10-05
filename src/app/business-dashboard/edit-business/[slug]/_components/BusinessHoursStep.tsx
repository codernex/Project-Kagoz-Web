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
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const d = new Date()
      d.setHours(h, m, 0, 0)
      times.push(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }))
    }
  }
  return times
}
const timeOptions = generateTimeOptions()

const transformToApiFormat = (data: BusinessHoursData) => {
  if (data.is24Hours || data.closedOnHolidays) return { isOpen247: true }
  const daysArray = Object.entries(data.businessHours)
    .filter(([, sch]) => sch.isOpen && sch.slots.length)
    .map(([day, sch]) => ({
      day,
      isOpen: true,
      timeRanges: sch.slots.map(s => {
        const parseTime = (t: string) => {
          const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
          return m ? { hours: m[1], minutes: m[2], period: (m[3] || "AM").toUpperCase() } : { hours: "9", minutes: "00", period: "AM" }
        }
        return { from: parseTime(s.start), to: parseTime(s.end) }
      })
    }))
  return daysArray.length ? { isOpen247: false, days: daysArray } : {}
}

const transformFromApiFormat = (apiData: any, daysList: string[]): BusinessHoursData => {
  if (apiData?.isOpen247) {
    const hours = Object.fromEntries(daysList.map(d => [d, { isOpen: true, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }]))
    return { is24Hours: true, closedOnHolidays: false, businessHours: hours }
  }

  const hours = Object.fromEntries(daysList.map(d => [d, { isOpen: false, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }]))
  const arrayData = Array.isArray(apiData) ? apiData : apiData?.days || []

  arrayData.forEach((d: any) => {
    if (d.day && hours[d.day]) {
      hours[d.day] = d.isOpen && d.timeRanges?.length
        ? { isOpen: true, slots: d.timeRanges.map((r: any) => ({ start: r.from || "9:00 AM", end: r.to || "6:00 PM" })) }
        : { isOpen: false, slots: [{ start: "9:00 AM", end: "6:00 PM" }] }
    }
  })

  return { is24Hours: false, closedOnHolidays: false, businessHours: hours }
}

interface TimeSlot { start: string; end: string }
interface DaySchedule { isOpen: boolean; slots: TimeSlot[] }
interface BusinessHoursData { is24Hours: boolean; closedOnHolidays: boolean; businessHours: Record<string, DaySchedule> }
interface BusinessHoursStepProps { data: BusinessHoursData; businessData?: any; onUpdate: (data: BusinessHoursData) => void; onNext: () => void; onBack: () => void }

export default function BusinessHoursStep({ data, businessData, onUpdate, onNext, onBack }: BusinessHoursStepProps) {
  console.log("🚀 ~ BusinessHoursStep ~ data:", data)
  const [formData, setFormData] = useState<BusinessHoursData>(data)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [setOpeningHours] = useSetOpeningHoursMutation()
  const slugParam = useParams()?.slug || ""
  const slug = decodeURIComponent((Array.isArray(slugParam) ? (slugParam[0] || "") : slugParam).trim().toLowerCase().replace(/\s+/g, "-"))
  const loaded = useRef(false)

  useEffect(() => {
    const existingHours = businessData?.openingHours || businessData?.businessHours
    if (existingHours?.length && !loaded.current) {
      loaded.current = true
      const apiData = transformFromApiFormat(existingHours, days)
      setFormData(apiData)
      onUpdate(apiData)
    } else if (!existingHours?.length) {
      const initial = {
        ...formData,
        closedOnHolidays: true,
        is24Hours: false,
        businessHours: Object.fromEntries(days.map(d => [d, { isOpen: d !== "Friday", slots: [{ start: "9:00 AM", end: "6:00 PM" }] }]))
      }
      setFormData(initial)
      onUpdate(initial)
    }
  }, [businessData])

  const validateTimeSlot = (start: string, end: string) => new Date(`2000-01-01 ${end}`) > new Date(`2000-01-01 ${start}`)
  const validateForm = () => {
    const newErrors: Record<string, string[]> = {}
    let valid = true
    if (!formData.is24Hours && !formData.closedOnHolidays && !days.some(d => formData.businessHours[d]?.isOpen)) {
      newErrors.general = ["Select at least one day, enable 24/7, or closed on holidays"]
      valid = false
    }
    days.forEach(day => {
      if (formData.businessHours[day]?.isOpen) {
        const dayErrors = formData.businessHours[day].slots.map((s, i) => !validateTimeSlot(s.start, s.end) ? `Slot ${i + 1} end must be after start` : null).filter(Boolean) as string[]
        if (dayErrors.length) { newErrors[day] = dayErrors; valid = false }
      }
    })
    setErrors(newErrors)
    return valid
  }

  const updateFormData = (updated: Partial<BusinessHoursData>) => {
    const newData = { ...formData, ...updated }
    setFormData(newData)
    onUpdate(newData)
    if (errors.general) setErrors(prev => { const e = { ...prev }; delete e.general; return e })
  }

  const toggleDay = (day: string) => {
    const curr = formData.businessHours[day]
    if (!curr) return
    const updated = { ...formData.businessHours, [day]: { ...curr, isOpen: !curr.isOpen, slots: curr.isOpen ? curr.slots : [{ start: "9:00 AM", end: "6:00 PM" }] } }
    updateFormData({ businessHours: updated })
    if (errors[day]) setErrors(prev => { const e = { ...prev }; delete e[day]; return e })
  }

  const modifySlot = (day: string, idx: number, field: 'start' | 'end', value: string) => {
    const curr = formData.businessHours[day]
    if (!curr) return
    const slots = [...curr.slots]; slots[idx] = { ...slots[idx], [field]: value } as TimeSlot
    updateFormData({ businessHours: { ...formData.businessHours, [day]: { ...curr, slots } } })
    if (errors[day]) setErrors(prev => { const e = { ...prev }; delete e[day]; return e })
  }

  const addSlot = (day: string) => {
    const curr = formData.businessHours[day]; if (!curr) return
    updateFormData({ businessHours: { ...formData.businessHours, [day]: { ...curr, slots: [...curr.slots, { start: "9:00 AM", end: "6:00 PM" }] } } })
  }

  const removeSlot = (day: string, idx: number) => {
    const curr = formData.businessHours[day]; if (!curr || curr.slots.length <= 1) return
    updateFormData({ businessHours: { ...formData.businessHours, [day]: { ...curr, slots: curr.slots.filter((_, i) => i !== idx) } } })
  }


  const handleNext = async () => { if (!validateForm()) return; await setOpeningHours({ slug, ...transformToApiFormat(formData) }).unwrap(); onNext() }
  const handleBack = async () => { if (!validateForm()) return; await setOpeningHours({ slug, ...transformToApiFormat(formData) }).unwrap(); onBack() }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4"><Clock className="w-[24px] h-[24px] text-[#9333EA]" /><h3 className="auth-heading !font-medium text-[#111827]">Business Hours & Availability</h3></div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">When are you open?</p>

      <div className="space-y-6">
        {!formData.is24Hours && (
          <div>
            <Label className="text-sm font-medium">Days Open</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {dayAbbr.map((abbr, i) => {
                const day = days[i]; if (!day) return null
                const open = formData.businessHours[day]?.isOpen
                return <button key={day} className={`px-[53px] py-[13px] rounded ${open ? "border-[#9333EA] border bg-[#F1EBFF] text-[#9333EA]" : "text-[#2D3643] bg-white border-[#E4E4E4] border"}`} onClick={() => toggleDay(day)}>{abbr}</button>
              })}
            </div>
          </div>
        )}

        {errors.general && <div className="bg-red-50 border border-red-200 rounded-md p-3">{errors.general.map((e,i)=><p key={i} className="text-red-600 text-sm">{e}</p>)}</div>}

        <Label>Optional Toggles:</Label>
        <div className="flex flex-col gap-5">
          <div className="flex gap-[11.5px]"><Switch id="24-7" checked={formData.is24Hours} onCheckedChange={c => updateFormData({ is24Hours: c, closedOnHolidays: c ? false : formData.closedOnHolidays })} /><h2 className="text-sm font-normal">24/7 Open</h2></div>
          <div className="flex gap-[11.5px]"><Switch id="holidays" checked={formData.closedOnHolidays} onCheckedChange={c => !formData.is24Hours && updateFormData({ closedOnHolidays: c })} disabled={formData.is24Hours} /><h2 className={`text-sm font-normal ${formData.is24Hours ? 'text-gray-400' : ''}`}>Closed on Public Holidays</h2></div>
        </div>



        {!formData.is24Hours && days.map(day => formData.businessHours[day]?.isOpen && (
          <div key={day} className="border-gray-200 border rounded-[8px] p-4 space-y-3">
            <Label className="text-sm font-medium text-gray-900">{day}:</Label>
            {errors[day] && <div className="bg-red-50 border border-red-200 rounded-md p-2">{errors[day].map((e,i)=><p key={i} className="text-red-600 text-xs">{e}</p>)}</div>}
            {formData.businessHours[day].slots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-[12px] text-[#353535] mb-3">
                <span className="text-gray-500">Time Slot {idx+1}:</span>
                <Select value={slot.start} onValueChange={v=>modifySlot(day,idx,'start',v)}><SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]"><SelectValue>{slot.start}</SelectValue></SelectTrigger><SelectContent>{timeOptions.map(t=><SelectItem key={t} value={t} className="text-[#353535]">{t}</SelectItem>)}</SelectContent></Select>
                <span className="text-gray-500">→</span>
                <Select value={slot.end} onValueChange={v=>modifySlot(day,idx,'end',v)}><SelectTrigger className="w-[120px] h-[40px] border border-gray-300 rounded-[8px]"><SelectValue>{slot.end}</SelectValue></SelectTrigger><SelectContent>{timeOptions.map(t=><SelectItem key={t} value={t} className="text-[#353535]">{t}</SelectItem>)}</SelectContent></Select>
                {formData.businessHours[day]?.slots.length && formData.businessHours[day].slots.length>1 && <Button variant="ghost" size="sm" onClick={()=>removeSlot(day,idx)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"><X className="w-[16px] h-[16px]"/></Button>}
              </div>
            ))}
            <button className="text-[#6F00FF] cursor-pointer p-0 h-auto" onClick={()=>addSlot(day)}>+ Add Another Time Slot</button>
          </div>
        ))}
      </div>

      <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
        <button onClick={handleBack} className="!px-20 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987] rounded-lg">Save & Back</button>
        <button onClick={handleNext} className="!px-20 !py-3 cursor-pointer bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg">Save & Continue</button>
      </div>
    </div>
  )
}