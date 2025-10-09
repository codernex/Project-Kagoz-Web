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
import { Control, FieldPath } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

interface DateSelectorProps {
  label?: string
  name: string
  required?: boolean
  onChange?: (date: { year: string; month: string; day: string }) => void
  control?: Control<any>
  value?: { year: string; month: string; day: string }
}

/**
 * ✅ Wrapper component - decides which version to render
 */
export function DateSelector({
  label,
  name,
  required,
  onChange,
  control,
  value,
}: DateSelectorProps) {
  // ✅ Controlled version (react-hook-form)
  if (control) {
    return (
      <DateSelectorControlled
        label={label ?? ""}
        name={name}
        required={required ?? false}
        control={control}
      />
    )
  }

  // ✅ Standalone version
  return (
    <DateSelectorCore
      label={label}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
    />
  )
}

/**
 * ✅ Standalone Date Selector (uncontrolled)
 */
function DateSelectorCore({
  label,
  name,
  required,
  onChange,
  value,
}: Omit<DateSelectorProps, "control">) {
  const [year, setYear] = React.useState(value?.year || "")
  const [month, setMonth] = React.useState(value?.month || "")
  const [day, setDay] = React.useState(value?.day || "")

  const years = React.useMemo(() => Array.from({ length: 50 }, (_, i) => `${2000 + i}`), [])
  const months = React.useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    []
  )
  const days = React.useMemo(() => Array.from({ length: 31 }, (_, i) => `${i + 1}`), [])

  // Sync external value into local state
  React.useEffect(() => {
    if (!value) return
    if (value.year !== undefined) setYear(value.year)
    if (value.month !== undefined) setMonth(value.month)
    if (value.day !== undefined) setDay(String(parseInt(value.day) || value.day))
  }, [value])

  // Notify parent when changed
  React.useEffect(() => {
    if (year && month && day && onChange) {
      onChange({ year, month, day })
    }
  }, [year, month, day]) // Removed onChange from dependencies to prevent infinite loop

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-[#374151] font-medium text-[16px]">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-4 mt-1 !text-[#374151]">
        {/* Year */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px] h-[48px] border border-[#E5E7EB] rounded-[8px]">
            <SelectValue placeholder={required ? "Year *" : "Year"} />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y} className="!text-[#374151]">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month */}
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[140px] h-[48px] border border-[#E5E7EB] rounded-[8px]">
            <SelectValue placeholder={required ? "Month *" : "Month"} />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m} className="!text-[#374151]">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Day */}
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="w-[100px] h-[48px] border border-[#E5E7EB] rounded-[8px]">
            <SelectValue placeholder={required ? "Day *" : "Day"} />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d} className="!text-[#374151]">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={year && month && day ? `${year}-${month}-${day}` : ""}
        required={required}
      />
    </div>
  )
}

/**
 * ✅ Controlled version for react-hook-form
 */
function DateSelectorControlled({
  label,
  name,
  required,
  control,
}: {
  label: string
  name: string
  required: boolean
  control: Control<any>
}) {
  return (
    <FormField
      control={control}
      name={name as FieldPath<any>}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DateSelectorCore
              label={label}
              name={name}
              required={required}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
