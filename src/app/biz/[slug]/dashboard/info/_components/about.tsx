"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useGetBusinessBySlugQuery, useUpdateBusinessMutation } from "@/redux/api"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"

export const AboutBusiness = () => {
    const { slug } = useParams() as { slug: string }
    
    const { data } = useGetBusinessBySlugQuery(slug)
    const form = useForm({
        defaultValues: {
            about: data?.about || ''
        },
        values: {
            about: data?.about || ''
        }
    })

    const [update] = useUpdateBusinessMutation()


    return (
        <div className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
        >
            <h2 className="text-[2.4rem] font-semibold">About Business</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(d => {
                    update({ slug, data: d })
                })} className="space-y-3">
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