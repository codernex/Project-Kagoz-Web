"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Control, FieldPath } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface DateSelectorProps {
  label?: string
  name: string
  required?: boolean
  onChange?: (date: { year: string; month: string; day: string }) => void
  control?: Control<any>
  value?: { year: string; month: string; day: string }
}

export function DateSelector({ label, name, required, onChange, control, value }: DateSelectorProps) {
  const [year, setYear] = React.useState(value?.year || "")
  const [month, setMonth] = React.useState(value?.month || "")
  const [day, setDay] = React.useState(value?.day || "")

  const years = Array.from({ length: 50 }, (_, i) => `${2000 + i}`)
  console.log("🔍 DateSelector - Available years:", years.slice(0, 10), "...")
  console.log("🔍 DateSelector - Current year state:", year)
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`)

  // Sync with external value prop
  React.useEffect(() => {
    console.log("🔍 DateSelector - Value prop changed:", value)
    if (value?.year !== undefined) {
      console.log("🔍 DateSelector - Setting year:", value.year)
      setYear(value.year)
    }
    if (value?.month !== undefined) {
      console.log("🔍 DateSelector - Setting month:", value.month)
      setMonth(value.month)
    }
    if (value?.day !== undefined) {
      // Normalize day value - remove leading zeros
      const normalizedDay = String(parseInt(value.day) || value.day)
      console.log("🔍 DateSelector - Setting day:", value.day, "-> normalized:", normalizedDay)
      setDay(normalizedDay)
    }
  }, [value])

  React.useEffect(() => {
    if (year && month && day && onChange) {
      onChange({ year, month, day })
    }
  }, [year, month, day])

  const Core = (
    <div className="space-y-2">
      {label && (
        <Label className="text-[#23272E] font-medium text-[16px]">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-4 mt-1">
        {/* Year */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E]  focus:ring-[#23272E] placeholder:text-[#6B7280] shadow-sm">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y} className="text-[#23272E]">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month */}
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[140px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] outline-none focus:ring-[#23272E] placeholder:text-[#6B7280] shadow-sm">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m} className="text-[#23272E]">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Day */}
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="w-[100px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] outline-none focus:ring-[#23272E] placeholder:text-[#6B7280] shadow-sm">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d} className="text-[#23272E]">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* hidden input to integrate with forms */}
      <input
        type="hidden"
        name={name}
        value={year && month && day ? `${year}-${month}-${day}` : ""}
        required={required}
      />
    </div>
  )

  if (control) {
    return (
      <FormField
        control={control}
        name={name as FieldPath<any>}
        render={({ field }) => {
          // hydrate from existing field value (reactive to changes)
          React.useEffect(() => {
            const v: any = field.value
            if (v && typeof v === 'object') {
              if (v.year && v.year !== year) setYear(v.year)
              if (v.month && v.month !== month) setMonth(v.month)
              if (v.day && v.day !== day) setDay(v.day)
            }
          }, [field.value])
          // push updates to RHF when local state changes
          React.useEffect(() => {
            if (year && month && day) {
              field.onChange({ year, month, day })
            }
          }, [year, month, day])
          return (
            <FormItem>
              {/* {label && (
                <FormLabel className="text-[#23272E] font-medium text-[16px]">
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              )} */}
              <FormControl>
                <div>{Core}</div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  }

  return Core
}
