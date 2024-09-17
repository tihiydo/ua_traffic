import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";

const Footer = () => {
    return (
        <div className={`bg-main`}>
            <div className="container text-white py-8 grid md:grid-cols-[0.6fr_1.4fr] grid-cols-1">

                <div className="mb-8 md:mb-0">
                    <h3 className="mb-4 font-kankin text-4xl">UATRAFFIC</h3>
        
                    <p className="text-sm text-white/80 min-w-[223px]">
                            UATRAFFIC.COM © {new Date().getFullYear()}
                    </p>
                </div>

                <div className="flex flex-row gap-x-[40px] max-[634px]:flex-wrap">
                    <div className="flex mb-8 md:mb-0">
                        <div>
                            <h5 className="mb-3 font-title">
                                <Translate namespace="Footer" itemKey="support-title" />
                            </h5>

                            <div className="flex flex-col gap-y-2">
                                <Link href="https://t.me/uatraffic_support" target="_blank" className="text-white/80 hover:text-white transition-colors"><Translate namespace="Footer" itemKey="support-value"  /></Link>
                                <Link href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCHrgldnPgHlNdtTvMdPXWTWJsLlQXsxpLWSVBSllhpJXfJQblQXjxkPSzjXMVgGRtqSbqdV" target="_blank" className="text-white/80 hover:text-white transition-colors">support@uatraffic.com</Link>
                            </div>
                        </div>
                    </div>
        
                    <div className="flex mb-8 md:mb-0">
                        <div>
                            <h5 className="mb-3 font-title ">
                                <Translate namespace="Footer" itemKey="info-title" />
                            </h5>

                            <div className="flex flex-col gap-y-2">
                                <Link href="/info/order" className="text-white/80 hover:text-white transition-colors"><Translate namespace="Other" itemKey="order" /></Link>
                                {/* <Link href="/info/rules" className="text-white/80 hover:text-white transition-colors"><Translate namespace="Other" itemKey="rules" /></Link> */}
                                <Link href="/info/privacy-policy" className="text-white/80 hover:text-white transition-colors"><Translate namespace="Other" itemKey="policy" /></Link>
                            </div>
                        </div>
                    </div>
        
                    <div className="flex mb-6 md:mb-0">
                        <div>
                            <h5 className="mb-3 font-title">
                                <Translate namespace="Footer" itemKey="community-title" />
                            </h5>

                            <div className="flex flex-col gap-y-2">
                                <Link className="text-white/80 hover:text-white transition-colors" href={'https://www.instagram.com/ua.traffic'} target="_blank">INSTAGRAM</Link>
                                <Link className="text-white/80 hover:text-white transition-colors" href={'https://t.me/uatraffic_com'} target="_blank">TELEGRAM</Link>
                                <Link className="text-white/80 hover:text-white transition-colors" href={'https://www.youtube.com/@UATraffic'} target="_blank">YOUTUBE</Link>
                                <Link className="text-white/80 hover:text-white transition-colors" href={'https://www.tiktok.com/@ua.traffic'} target="_blank">TIKTOK</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Footer };
