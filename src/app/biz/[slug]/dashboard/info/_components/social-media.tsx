"use client"
import { CustomButton } from "@/components/shared/custom-button"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGetBusinessBySlugQuery, useUpdateBusinessMutation } from "@/redux/api"
import { FacebookIcon, InstagramIcon, LinkedinIcon, LucideIcon, TwitterIcon, YoutubeIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

const socialMedia: {
    name: string,
    Icon: LucideIcon,
    placeholder: string
}[] = [
        { name: 'facebook', Icon: FacebookIcon, placeholder: 'https://facebook.com' },
        { name: 'linkedin', Icon: LinkedinIcon, placeholder: 'https://linkedin.com' },
        { name: 'instagram', Icon: InstagramIcon, placeholder: 'https://instagram.com' },
        { name: 'twitter', Icon: TwitterIcon, placeholder: 'https://twitter.com' },
        { name: 'youtube', Icon: YoutubeIcon, placeholder: 'https://youtube.com' },
    ]
export const SocialMediaLink = () => {
    const { slug } = useParams() as { slug: string }
    const { data } = useGetBusinessBySlugQuery(slug, { skip: !slug })
    const [update] = useUpdateBusinessMutation()

    const defaultValues = useMemo(() => {
        return {
            facebook: data?.facebook || '',
            linkedin: data?.linkedin || '',
            instagram: data?.instagram || '',
            twitter: data?.twitter || '',
            youtube: data?.youtube || ''
        }
    }, [data])
    const form = useForm({
        defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const { isDirty } = form.formState
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Social Media Link</h2>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => {
                        update({ slug, data: d })
                        form.reset({ ...defaultValues })
                    })}>
                        <div className="grid grid-cols-2 gap-8">
                            {
                                socialMedia.map(({ name, Icon, placeholder }) => {
                                    return (
                                        <FormField
                                            key={name}

                                            render={({ field }) => {

                                                return (
                                                    <FormItem className="flex items-center border h-[6rem] border-[#EDEDED] border-b !my-0 rounded-[.8rem]">
                                                        <div className="flex h-full items-center  px-6 border-r border-[#ededed] pr-8">
                                                            <div className={
                                                                cn('w-[3.4rem] h-[3.4rem] rounded-full text-white flex items-center justify-center', name === 'facebook' && 'bg-[#0862F6]', name === 'instagram' && 'instagram', name === 'youtube' && 'bg-[#DF2016]', name === 'linkedin' && 'bg-[#0073AF]', name === 'twitter' && 'bg-[#45a4e1]')
                                                            }>
                                                                <Icon size={20} className={
                                                                    cn('', (name === 'facebook' || name === 'linkedin' || name === 'twitter') && 'fill-white')
                                                                } />
                                                            </div>
                                                        </div>
                                                        <Input placeholder={placeholder} className="!h-full !mt-0 z-0 border-none rounded-tl-none rounded-bl-none" {...field} />
                                                    </FormItem>
                                                )
                                            }}
                                            control={form.control}
                                            name={name as 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube'}
                                        />
                                    )
                                })
                            }
                        </div>
                        <div className="flex justify-end">
                            {
                                isDirty ? <CustomButton className="bg-black rounded-xs">Save</CustomButton> : null
                            }
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}