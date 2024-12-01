"use client"
import FileUploadDropdown from "@/components/shared/file-upload-dropdown";
import { TextInput } from "@/components/shared/text-input";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export const VerifiedLicense = () => {
    const form = useForm({
        defaultValues: {
            tradeLicenseExpiryDate: '',
            businessAwardIssuedDate: ''
        }
    })
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Verified License</h2>
            <div>


                <Form {...form}>
                    <form className="space-y-3">
                        <h3 className="mb-2 font-bold">Trade License</h3>
                        <TextInput control={form.control} name={'tradeLicenseExpiryDate'} type="date" label={'Expiry Date'} placeholder={'DD/MM/YYYY'} />

                        <div>
                            <Label>Document</Label>
                            <FileUploadDropdown />
                        </div>

                        <h3 className="mb-2 font-bold">Business Awards</h3>
                        <TextInput control={form.control} name={'businessAwardIssuedDate'} type="date" label={'Issue Date'} placeholder={'DD/MM/YYYY'} />

                        <div>
                            <Label>Document</Label>
                            <FileUploadDropdown />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};