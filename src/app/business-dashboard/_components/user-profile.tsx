import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { userUserProfile } from "@/hooks/userProfileModal"
import { successMessage, appendApi } from "@/lib/utils"
import { axiosInstance } from "@/redux/api"
import { useMemo, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"

export const UserProfile = () => {
    const { open, setOpen, user } = userUserProfile()
    const [file, setFile] = useState<File | null>()
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    
    const defaultValues = useMemo(() => {
        return {
            ownerText: user?.ownerText || ''
        }
    }, [user])
    
    const form = useForm({
        defaultValues,
        values: defaultValues
    })

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            form.reset({
                ownerText: user.ownerText || ''
            })
            setPreviewImage(user.imageUrl ? appendApi(user.imageUrl) : null)
        }
    }, [user, form])

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    setPreviewImage(e.target?.result as string)
                } catch (error) {
                    console.warn('FileReader error handled:', error);
                }
            }
            reader.onerror = (error) => {
                console.warn('FileReader error:', error);
            }
            reader.readAsDataURL(selectedFile)
        }
    }
    const handleClose = () => {
        setFile(null)
        setPreviewImage(user?.imageUrl ? appendApi(user.imageUrl) : null)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
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
                            handleClose()
                        }).catch(err => {
                            toast.error(err?.response?.data?.message)
                        })

                    })} className="space-y-4">
                        <div>
                            <FormLabel className="mb-2 inline-block">Profile Picture</FormLabel>
                            {previewImage && (
                                <div className="mb-4">
                                    <Image 
                                        src={previewImage} 
                                        alt="Profile preview" 
                                        width={100} 
                                        height={100} 
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            )}
                            <Input onChange={handleFileChange} type="file" accept="image/*" />
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
