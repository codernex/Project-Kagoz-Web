import { Flex } from "@/components/shared/flex";
import { GeneralInfo } from "./_components/general-info";
import { Category } from "./_components/category";


export default function BusinessInfo() {

  return (
    <div className="space-y-[4rem]">
      <GeneralInfo />
      <Category/>
    </div>
  );
}
