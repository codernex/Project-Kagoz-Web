import { AboutBusiness } from "./_components/about";
import { Category } from "./_components/category";
import { BusinessFacilities } from "./_components/facilities";
import { Faqs } from "./_components/faq";
import { GeneralInfo } from "./_components/general-info";
import { OpeningHour } from "./_components/opeing-hour";
import { SocialMediaLink } from "./_components/social-media";
import { VerifiedLicense } from "./_components/verified-license";


export default function BusinessInfo() {

  return (
    <div className="space-y-[4rem]">
      <GeneralInfo />
      <Category />
      <BusinessFacilities />
      <VerifiedLicense />
      <SocialMediaLink />
      <OpeningHour/>
      <AboutBusiness/>
      <Faqs/>
    </div>
  );
}
