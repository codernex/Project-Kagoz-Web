import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { userUserProfile } from "@/hooks/userProfileModal"
import { successMessage } from "@/lib/utils"
import { axiosInstance } from "@/redux/api"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const UserProfile = () => {
    const { open, setOpen, user } = userUserProfile()
    const [file, setFile] = useState<File | null>()
    const defaultValues = useMemo(() => {
        return {
            ownerText: user?.ownerText || ''
        }
    }, [user])
    const form = useForm({
        defaultValues,
        values: defaultValues
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl !rounded-xs text-black">
                <DialogHeader>
                    <DialogTitle className="text-md">
                        Profile
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => {
                        // TODO: update user profile
                        const formData = new FormData()

                        if (file) formData.append('file', file)
                        formData.append('ownerText', d.ownerText)
                        // TODO: send request to server
                        axiosInstance.patch('/auth/update/' + user?.id, formData, {
                            headers: {
                                "Content-Type": 'multipart/form-data'
                            }
                        }).then(() => {
                            successMessage("Profile Updated")
                        }).catch(err => {
                            toast.error(err?.response?.data?.message)
                        })
                        setOpen(false)

                    })} className="space-y-4">
                        <div>
                            <FormLabel className="mb-2 inline-block">Profile Picture</FormLabel>
                            <Input onChange={e => setFile(e.target.files ? e.target.files[0] : undefined)} type="file" />
                        </div>
                        <FormField control={form.control} name="ownerText" render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        About You
                                    </FormLabel>
                                    <Textarea {...field} rows={5} placeholder="about you. this information will reflect to your business details page" className="placeholder:text-muted" />
                                </FormItem>
                            )
                        }} />
                        <Button className="rounded-xs">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}