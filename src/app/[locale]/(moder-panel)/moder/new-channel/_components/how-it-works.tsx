
import Translate from '@/components/Translate';
import { Lightbulb } from 'lucide-react';

type Props = {

}

const HowItWorks = ({ }: Props) => {
    return (
        <div className={`p-4 py-9 rounded-xl top-0 block mx-auto relative mt-14 max-w-[400px] h-fit w-full bg-yellow lg:w-[250px] lg:absolute lg:right-0 lg:-top-14  lg:mt-0`}>
            <div className='absolute -top-6 left-7 bg-main rounded-full text-white p-2'>
                <Lightbulb />
            </div>

            <h2 className='text-lg font-bold mb-2'><Translate namespace="Default" itemKey="howitwork"/></h2>

            <div className='w-full flex flex-col gap-4 md:text-sm  text-xs text-[#797979]'>
                <Translate namespace='Landing' itemKey='howworkdescr'/>
            </div>
        </div>
    )
}

export default HowItWorks