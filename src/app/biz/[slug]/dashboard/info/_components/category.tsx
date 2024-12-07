"use client"
import { Flex } from "@/components/shared/flex";
import { SelectSearch } from "@/components/shared/select-search";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from "@/redux/api/category";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const category = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
    { id: 4, name: "Category 4" },
    { id: 5, name: "Category 5" },
    { id: 6, name: "Category 6" },
    { id: 7, name: "Category 7" },
    { id: 8, name: "Category 8" },
    { id: 9, name: "Category 9" },
    { id: 10, name: "Category 10" },
]
export const Category = () => {

    const form = useForm({
        defaultValues: {
            categoryId: 0,
            subCategories: [] as any[]
        }
    })

    const { data: categories } = useGetCategoriesQuery()
    const { data: subCategories } = useGetSubcategoriesQuery(form.watch('categoryId'))
    
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Category</h2>
            <Form {...form}>
                <form className="space-y-[2rem]">
                    <Flex className="gap-x-[2rem]">
                        <FormField
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel className="mb-3 font-normal">Category</FormLabel>
                                    <SelectSearch placeholder="Select Category" value={field.value} options={categories} onChange={(v) => field.onChange(v)} />
                                </FormItem>
                            )}
                            control={form.control}
                            name="categoryId"
                        />

                        <div className="w-full">
                            <Label className="mb-3 font-normal">Category</Label>
                            <SelectSearch value={''} placeholder="Select Sub-category" options={subCategories} onChange={(v) => {
                                const sub = subCategories?.find(s => s.id === v)
                                if (form.watch('subCategories').findIndex(s => s.id === sub?.id) !== -1) {
                                    toast.error("This subcategory already selected")
                                } else {
                                    form.setValue('subCategories', [...form.watch('subCategories'), sub])
                                }
                            }} />
                        </div>

                    </Flex>

                    <div className="flex flex-wrap gap-sm">
                        {form.watch('subCategories').map((s, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex max-w-fit items-center justify-between px-4 py-2 border rounded-xl bg-bgPrimaryShade border-borderColor min-w-[16rem]"
                                >
                                    <span className="text-xsm text-muted">{s.name}</span>
                                    <div
                                        onClick={() =>
                                            form.setValue(
                                                'subCategories',
                                                form.watch('subCategories').filter((_, i) => i !== index)
                                            )
                                        }
                                        className="bg-white rounded-full w-[2.4rem] h-[2.4rem] flex items-center justify-center cursor-pointer"
                                    >
                                        <XIcon className="fill-white stroke-black" size={18} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </form>
            </Form>
        </div>
    )
}