"use client"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"

export const Faqs = () => {
    const form = useForm({
        defaultValues: {
            faqs: [
                {
                    question: '',
                    answer: ''
                }
            ]
        }
    })
    return (
        <div className="p-6 space-y-8 text-black bg-white rounded-lg shadow"
        >
            <h2 className="text-[2.4rem] font-semibold">{"FAQ's"}</h2>

            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit((d) => {
                    console.log(d);
                })}>
                    <div>
                        <div className="flex flex-col gap-8">
                            {
                                form.watch('faqs').map((_, index) => {
                                    return (
                                        <div key={index} className="space-y-3">
                                            <FormField control={form.control} name={`faqs.${index}.question`} render={({ field }) => {

                                                return (
                                                    <FormItem>
                                                        <FormLabel>Question</FormLabel>
                                                        <Input placeholder="Test message" className="placeholder:text-muted" {...field} />
                                                    </FormItem>
                                                )
                                            }} />
                                            <FormField control={form.control} name={`faqs.${index}.answer`} render={({ field }) => {

                                                return (
                                                    <FormItem>
                                                        <FormLabel>Answer</FormLabel>
                                                        <Textarea placeholder="Faq" className="placeholder:text-muted" {...field} />
                                                    </FormItem>
                                                )
                                            }} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Button onClick={() => form.setValue('faqs', [...form.watch('faqs'), { question: '', answer: '' }])} type="button" variant="outline" className="mt-4 border-primary text-primary hover:text-primary">
                            <PlusIcon />
                            <span>Add FAQ</span>
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        {
                            form.getFieldState('faqs').isDirty && (
                                <Button>
                                    Save
                                </Button>
                            )
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}