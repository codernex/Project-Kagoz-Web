"use client"
import { useForm } from "react-hook-form"
import { TextInput } from "@/components/shared/text-input";
import { Form } from "@/components/ui/form";
import { Flex } from "@/components/shared/flex";
import FileUploadDropdown from "@/components/shared/file-upload-dropdown";
import { useState } from "react";
import { Label } from "@/components/ui/label";
export const GeneralInfo = () => {
    const [file, setFile] = useState<File | undefined>()
    console.log(file);

    const generalInfoForm = useForm()
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">General Info</h2>
            <Form {...generalInfoForm}>
                <form className="space-y-[2rem]">
                    <Flex className="gap-x-[2rem]">
                        <TextInput placeholder="Enter Business Name" control={generalInfoForm.control} label="Business Name" />
                        <TextInput placeholder="Enter Mobile Number" control={generalInfoForm.control} label="Business Mobile No" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <TextInput placeholder="Enter Email" control={generalInfoForm.control} label="Business Email" />
                        <TextInput placeholder="Enter Your City" control={generalInfoForm.control} label="City" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <TextInput placeholder="Select your state" control={generalInfoForm.control} label="State" />
                        <TextInput placeholder="Enter Postal Code" control={generalInfoForm.control} label="Postal Code" />
                    </Flex>
                    <Flex className="gap-x-[2rem]">
                        <TextInput placeholder="Enter Street Address" control={generalInfoForm.control} label="Street Address" />
                        <TextInput type="date" placeholder="Enter Business Starting Date" control={generalInfoForm.control} label="Business Starting Date" />
                    </Flex>
                    <div className="max-w-[450px]">
                        <Label>Upload Logo</Label>
                        <FileUploadDropdown onChange={setFile} />
                    </div>
                </form>
            </Form>
        </div>
    )
}