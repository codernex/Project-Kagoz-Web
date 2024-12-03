"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export const AboutBusiness = () => {
    const [files, setFiles] = useState<File[]>([])
    const form = useForm({
        defaultValues: {
            about: ''
        }
    })

    useEffect(() => {
        console.log(files);
    }, [files])

    return (
        <div className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
        >
            <h2 className="text-[2.4rem] font-semibold">About Business</h2>
            <Form {...form}>
                <form className="space-y-3">
                    <FormField
                        render={({ field }) => {

                            return (
                                <FormItem>
                                    <FormLabel>
                                        About Business
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Test message" className="placeholder:text-muted" {...field} />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                        control={form.control} name="about" />

                    <div className="flex justify-end">
                        {
                            form.getFieldState('about').isDirty ? <Button className="bg-black rounded-xs">Save</Button> : null
                        }
                    </div>
                </form>
            </Form>

        </div>
    )
}