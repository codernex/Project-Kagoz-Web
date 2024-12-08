"use client"
import { CustomButton } from "@/components/shared/custom-button";
import FileUploadDropdown from "@/components/shared/file-upload-dropdown";
import { TextInput } from "@/components/shared/text-input";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useUpdateLicenseMutation } from "@/redux/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const VerifiedLicense = () => {
    const { slug } = useParams() as { slug: string }
    const [files, setFiles] = useState<File[]>([])
    const form = useForm({
        defaultValues: {
            date: '',
        }
    })
    const [updateLicense] = useUpdateLicenseMutation()
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Verified License</h2>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => {
                        if (!files.length) {
                            toast.error("You must select an image of your document")
                            return
                        }
                        const formData = new FormData()
                        formData.append('date', d.date)
                        if (files.length) {
                            formData.append('image', files[0] as any)
                        }
                        updateLicense({ slug, data: formData })
                        form.reset()
                        setFiles([])
                    })} className="space-y-3">
                        <h3 className="mb-2 font-bold">Trade License</h3>
                        <TextInput control={form.control} name={'date'} type="date" label={'Expiry Date'} placeholder={'DD/MM/YYYY'} />

                        <div>
                            <Label>Document</Label>
                            <FileUploadDropdown accept="image/jpg,image/jpeg,image/png" selectedFiles={files} setSelectedFiles={setFiles} />
                        </div>

                        <div className="flex justify-end">
                            {
                                form.getFieldState('date').isDirty && files.length ? (
                                    <CustomButton className="bg-black rounded-xs">Save</CustomButton>
                                ) : null
                            }
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};