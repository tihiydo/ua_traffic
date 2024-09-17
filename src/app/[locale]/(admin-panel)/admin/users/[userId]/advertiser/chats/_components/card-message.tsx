import { CheckCheck } from "lucide-react"

type Props = 
{
    text: string
    who: 'me' | string
}

const CardMessage = (props: Props) => 
{
    return (
        <>
            <div className={`bg-yellow rounded-md max-w-[50%] w-fit p-5 flex relative mb-6 ${props.who != "me" ? `float-right` : ``}`}>
                <div className="break-all mr-2">{props.text}</div>
                <div className="flex text-sm items-center">15:15 <CheckCheck className="ml-2" size={16} color="#000000" strokeWidth={1.5} /></div>
            </div>
        </>
    )
}

export default CardMessage