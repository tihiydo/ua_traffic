import { Select } from "@/components/ui/select"
import { type Conservations } from '../_types/messages'
import { Dispatch, SetStateAction } from "react"
import Translate from "@/components/Translate"

type Props =
{
    conservations: Conservations[]
    onSelected: any
}

const MessageCard = (props: Props) => 
{
    return (
        <>
            {
            
                props.conservations.map(( value, key ) =>
                    <div key={key} className="w-full border-gray-secondary border h-[8rem] rounded-md p-4 mb-2 cursor-pointer" onClick={() => props.onSelected(value.id)}>
                        <h3 className="font-bold"><Translate namespace="Advertiser" itemKey="order"/> №{key + 1}</h3>
                        <p>{value.with}</p>
                        <p className="w-70% text-gray-last break-words">{ value?.message?.[0]?.text && value?.message?.[0]?.text.length > 80 ? value.message?.[0]?.text.slice(0, 80) :  value?.message?.[0]?.text}</p>
                    </div>
                )
            }
        </>
    )
}

export default MessageCard