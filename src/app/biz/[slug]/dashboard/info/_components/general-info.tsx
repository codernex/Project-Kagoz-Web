"use client"
import { CustomButton } from "@/components/shared/custom-button";
import FileUploadDropdown from "@/components/shared/file-upload-dropdown";
import { Flex } from "@/components/shared/flex";
import { TextInput } from "@/components/shared/text-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetBusinessBySlugQuery, useUpdateBusinessMutation } from "@/redux/api";
import { InfoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type GeneralInfoInput = {
    name: string
    email: string
    mobile: string
    city: string
    state: string
    postalCode: string
    streetAddress: string
    startingDate: string
    website: string
    youtubeVideo: string
}
export const GeneralInfo = () => {
    const [file, setFile] = useState<File[]>([])
    const { slug } = useParams() as { slug: string }
    const [update] = useUpdateBusinessMutation()

    const { data } = useGetBusinessBySlugQuery(slug, { skip: !slug })

    const defaultValues: GeneralInfoInput = {
        city: data?.city || '',
        email: data?.email || '',
        mobile: data?.mobile || '',
        name: data?.name || '',
        postalCode: data?.postalCode || '',
        startingDate: data?.startingDate || '',
        state: data?.state || '',
        streetAddress: data?.streetAddress || '',
        website: data?.website || '',
        youtubeVideo: data?.youtubeVideo || ''
    };

    const generalInfoForm = useForm({
        defaultValues,
    })

    useEffect(() => {
        generalInfoForm.reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    const { isDirty } = generalInfoForm.formState

    const onSubmit: SubmitHandler<GeneralInfoInput> = (d) => {
        const formData = new FormData()

        Object.entries(d).forEach(([key, value]) => {
            formData.append(key, value)
        })

        if (file.length) {
            formData.append('image', file[0] as any)
        }
        update({ slug, data: formData })
    }
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">General Info</h2>
            <Form {...generalInfoForm}>
                <form onSubmit={generalInfoForm.handleSubmit(onSubmit)} className="space-y-[2rem]">
                    <Flex className="gap-x-[2rem]">
                        <TextInput disabled name="name" placeholder="Enter Business Name" control={generalInfoForm.control} label="Business Name (Contact our support to edit your Business Name)" />
                        <TextInput name="mobile" placeholder="Enter Mobile Number" control={generalInfoForm.control} label="Business Mobile No" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <TextInput name="email" placeholder="Enter Email" control={generalInfoForm.control} label="Business Email" />
                        <TextInput name="city" placeholder="Enter Your City" control={generalInfoForm.control} label="City" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <TextInput name="state" placeholder="Select your state" control={generalInfoForm.control} label="Division" />
                        <TextInput name="postalCode" placeholder="Enter Postal Code" control={generalInfoForm.control} label="Postal Code" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <FormField
                            control={generalInfoForm.control}
                            name="streetAddress"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Street Adress
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Khan IT, 123 Road No. 7, Dhaka 1207" />
                                        </FormControl>
                                        <FormMessage>
                                            This address will show users nearest business.
                                            This address will be used to calculate the distance between your business and the {"user's"} location.
                                            <div className="flex gap-2 items-center text-red-600">
                                                <InfoIcon />
                                                <span>
                                                    Better you copy your google business address.
                                                </span>
                                            </div>

                                        </FormMessage>

                                    </FormItem>
                                )
                            }}
                        />

                    </Flex>
                    <TextInput required disabled={!!defaultValues.startingDate} name="startingDate" type="date" placeholder="Enter Business Starting Date" control={generalInfoForm.control} label="Business Starting Date" />
                    <Flex>
                        <TextInput name="website" control={generalInfoForm.control} placeholder="https://yourbusiness.com" label="Busines Website" />
                        <TextInput name="youtubeVideo" control={generalInfoForm.control} placeholder="https://www.youtube.com/watch?v=Cs2g2VFWtbo" label="Youtube Introduction Video" />
                    </Flex>
                    <div className="max-w-[450px]">
                        <Label>Upload Logo</Label>
                        <FileUploadDropdown setSelectedFiles={setFile} selectedFiles={file} />
                    </div>

                    <div className="flex justify-end w-full">
                        {
                            isDirty || file.length ? <CustomButton className="bg-black rounded-xs">Save</CustomButton> : null
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}