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
}

export function DateSelector({ label, name, required, onChange, control }: DateSelectorProps) {
  const [year, setYear] = React.useState("")
  const [month, setMonth] = React.useState("")
  const [day, setDay] = React.useState("")

  const years = Array.from({ length: 50 }, (_, i) => `${2000 + i}`)
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`)

  React.useEffect(() => {
    if (year && month && day && onChange) {
      onChange({ year, month, day })
    }
  }, [year, month, day, onChange])

  const Core = (
    <div className="space-y-2">
      {label && (
        <Label className="text-[#23272E] font-medium text-[16px]">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-4 mt-1">
        {/* Year */}
        <Select onValueChange={setYear}>
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
        <Select onValueChange={setMonth}>
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
        <Select onValueChange={setDay}>
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
          // hydrate from existing field value
          React.useEffect(() => {
            const v: any = field.value
            if (v && typeof v === 'object') {
              if (v.year) setYear(v.year)
              if (v.month) setMonth(v.month)
              if (v.day) setDay(v.day)
            }
          }, [])
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
