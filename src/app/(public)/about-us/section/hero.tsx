export const Hero = () => {
    return (
        <section className="container grid grid-cols-1 md:grid-cols-2 section_padding gap-[3rem] lg:gap-[10rem]">
            <div className="about-bg lg:h-[536px] h-[300px] bg-contain"></div>
            <div className="flex flex-col gap-y-[4rem]">
                <div>
                    <h2 className="section_title text-left">About us </h2>
                    <p className="text-muted font-light leading-loose">
                        Our achievement story is a very testament to teamworks and perseverance.
                        Together, we have overcome challenges, celebrated victories, and created a
                        narrative of progress and  story is a very testament to  success.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem]">
                    <div className="p-[2.4rem] bg-[#FAFAFA] rounded-smd border border-[#ededed] px-[5rem] flex flex-col justify-center">
                        <h2 className="text-[2.4rem] font-bold text-black">6+ years</h2>
                        <p className="text-muted leading-loose">
                            Influencing Digital Landscapes
                            Together
                        </p>
                    </div>
                    <div className="p-[2.4rem] bg-[#FAFAFA] rounded-smd border border-[#ededed] px-[5rem] flex flex-col justify-center">
                        <h2 className="text-[2.4rem] font-bold text-black">125+ Projects</h2>
                        <p className="text-muted leading-loose">
                            Excellence Achieved Through
                            Success
                        </p>
                    </div>
                    <div className="p-[2.4rem] bg-[#FAFAFA] rounded-smd border border-[#ededed] px-[5rem] flex flex-col justify-center">
                        <h2 className="text-[2.4rem] font-bold text-black">26+ Awards</h2>
                        <p className="text-muted leading-loose">
                            Our Dedication to Innovation
                            Wins Understanding
                        </p>
                    </div>
                    <div className="p-[2.4rem] bg-[#FAFAFA] rounded-smd border border-[#ededed] px-[5rem] flex flex-col justify-center">
                        <h2 className="text-[2.4rem] font-bold text-black">99% Happy Clients</h2>
                        <p className="text-muted leading-loose">
                            Mirrors our Focus on Client
                            Satisfaction
                        </p>
                    </div>
                </div>
            </div>

        </section>
    )
}