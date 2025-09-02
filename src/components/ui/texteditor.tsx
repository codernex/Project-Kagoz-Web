"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Bold, ClipboardMinus, Italic, LinkIcon, List } from "lucide-react"
import Image from "next/image"
import { useState, useCallback } from "react"
import { Control, FieldPath } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

function EditorCore({
  label = "About",
  required = false,
  id = "about",
  placeholder = "Detailed description of your business, services, and what makes you unique...",
  value = "",
  onChange = (html: string) => {},
}: {
  label?: string
  required?: boolean
  id?: string
  placeholder?: string
  value?: string
  onChange?: (html: string) => void
}) {
  const [characterCount, setCharacterCount] = useState(0)
  const maxLength = 5000

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      setCharacterCount(text.length)
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[120px] p-3 text-sm text-gray-800 placeholder-gray-400",
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[14px] sm:text-[16px] font-medium text-[#111827]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="border border-[#E4E4E4] rounded-[8px] relative">
        <EditorContent
          editor={editor}
          className="tiptap-editor text-[#353535] text-[14px] min-h-[80px] p-3"
          id={id}
          placeholder={placeholder}
        />
        {editor && editor.isEmpty && (
          <div className="absolute left-3 top-3 flex items-center pointer-events-none text-gray-400">
            {/* <Image src={placeholderIcon || "/icons/clipboard.png"} alt="placeholder icon" width={18} height={18} className="mr-2" /> */}
            <ClipboardMinus className="size-5 mr-2" />
            <span>{placeholder}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#E4E4E4] px-2 py-2">
          <div className="flex sm:gap-6 gap-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive("bold") ? "!text-[#686868] font-bold" : ""
              }`}
            >
              <Bold className="h-[16px] font-bold w-[16px] text-[#686868]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive("italic") ? "!text-[#686868] italic" : ""
              }`}
            >
              <Italic className="h-[16px] font-bold w-[16px] text-[#686868]" />
            </button>
            <button
              type="button"
              onClick={setLink}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive("link") ? "!text-[#686868]" : ""
              }`}
            >
              <LinkIcon className="h-[16px] font-bold w-[16px] text-[#686868]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive("bulletList") ? "!text-[#686868]" : ""
              }`}
            >
              <List className="h-[16px] font-bold w/[16px] text-[#686868]" />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {characterCount}/{maxLength} characters
          </div>
        </div>
      </div>
    </div>
  )
}

export function TiptapEditor({
  label = "About",
  required = false,
  id = "about",
  placeholder = "Detailed description of your business, services, and what makes you unique...",
  value = "",
  onChange = (html: string) => {},
  name,
  control,
}: {
  label?: string
  required?: boolean
  id?: string
  placeholder?: string
  value?: string
  onChange?: (html: string) => void
  name?: FieldPath<any>
  control?: Control<any>
}) {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormControl>
              <div>
                <EditorCore
                  label={label}
                  required={required}
                  id={id}
                  placeholder={placeholder}
                  value={typeof field.value === 'string' ? field.value : ''}
                  onChange={(html) => field.onChange(html)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <EditorCore
      label={label}
      required={required}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
