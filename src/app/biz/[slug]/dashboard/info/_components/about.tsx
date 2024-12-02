"use client"
import FileUploadDropdown from "@/components/shared/file-upload-dropdown"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { XIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export const AboutBusiness = () => {
    const [files, setFiles] = useState<File[]>([])
    const form = useForm({
        defaultValues: {
            about: ''
        }
    })

    const handleFileRemove = useCallback((index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }, [])

    useEffect(() => {
        console.log(files);
    }, [files])

    return (
        <div className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
        >
            <h2 className="text-[2.4rem] font-semibold">About Business</h2>
            <div className="space-y-2">
                <Label >About Business</Label>
                <Textarea placeholder="Test message" className="placeholder:text-muted"/>
            </div>

            <div className="space-y-2">
                <Label >Business Photo</Label>
                <div className="grid grid-cols-12">

                    <div className="col-span-4">
                        <FileUploadDropdown multiple selectedFiles={files} setSelectedFiles={setFiles} previewEnabled={false} />
                    </div>
                    <div>
                        {
                            files.map((file, index) => {
                                return (
                                    <div className="relative" key={index}>
                                        <img src={URL.createObjectURL(file)} alt="preview" />
                                        <div onClick={() => handleFileRemove(index)} className="absolute top-0 cursor-pointer bg-[#ededed] rounded-full -right-20">
                                            <XIcon />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}