"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "@/lib/utils"

const REGEXP_ONLY_DIGITS = /^[0-9]+$/

// Custom, minimal wrapper props – no collisions with DOM or library types
interface InputOTPProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  className?: string
  containerClassName?: string
  children?: React.ReactNode
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"]
  pattern?: string,
  label?: string
}

function InputOTP({
  value,
  onChange,
  maxLength = 6,
  className,
  containerClassName,
  children,
  inputMode = "numeric",
  autoComplete = "one-time-code",
  pattern = REGEXP_ONLY_DIGITS.source,
    label
}: InputOTPProps) {
  // Guard state updates so we never exceed maxLength and only allow digits
  const handleChange = React.useCallback(
    (next: string) => {
      const cleaned = next.replace(/\D/g, "")
      if (cleaned.length <= maxLength) onChange(cleaned)
    },
    [onChange, maxLength]
  )

  // Block extra numeric keystrokes once OTP is full
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const k = e.key
    const isDigit = /^[0-9]$/.test(k)
    const allowed =
      k === "Backspace" ||
      k === "Delete" ||
      k === "ArrowLeft" ||
      k === "ArrowRight" ||
      k === "Tab"

    if (!allowed && value.length >= maxLength && isDigit) {
      e.preventDefault()
    }
  }

  // Block extra input at the event-source level (covers IME & mobile)
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement> & { data?: string }) => {
    const data = (e as unknown as InputEvent).data ?? (e as any).data
    if (data && /\d/.test(data) && value.length >= maxLength) {
      e.preventDefault()
    }
  }

  // Sanitize paste: only digits and only up to remaining slots
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text") || ""
    const digitsOnly = pasted.replace(/\D/g, "")
    if (!digitsOnly) return
    const remaining = Math.max(0, maxLength - value.length)
    const next = (value + digitsOnly.slice(0, remaining)).slice(0, maxLength)
    onChange(next)
  }

  return (
     <div className="flex flex-col gap-2 w-full">
     {label && (
        <label className="common-text text-[#111827]">{label}</label>
      )}
    <OTPInput
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      containerClassName={cn("flex items-center gap-2", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      inputMode={inputMode}
      autoComplete={autoComplete}
      pattern={pattern}
      onKeyDown={handleKeyDown as any}
      onBeforeInput={handleBeforeInput as any}
      onPaste={handlePaste as any}
    >
      {children}
    </OTPInput>
    </div>
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex items-center justify-center",
        "w-[38px] h-[38px] sm:w-[48px] sm:h-[48px]", // 48px
        "border border-[#EDEDED] bg-white",
        "rounded-[8px]",
        "text-[2rem] font-medium text-[#111827]",
        isActive ? "border-black" : "border-[#EDEDED]",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {char}
    </div>
  )
}

export { InputOTP, InputOTPSlot }
