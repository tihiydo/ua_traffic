import React from 'react'

export type NestedListType = {
    items: Array<{
        text: string;
        list?: NestedListType;
    }>
}

type Props = {
    list: NestedListType;
    prefix?: string;
    
}

const NestedList = ({ list, prefix }: Props) => {
    return (
        <ul>
            {list.items.map((item, index) => {
                const itemPrefix = `${prefix ?? ''}${index + 1}.`;

                return (
                    <li className=' mb-3' key={itemPrefix + item.text}>
                        <div className='flex gap-2'>
                            <p className='font-bold'>{itemPrefix}</p>
                            <p>{item.text}</p>
                        </div>

                        <div className='ml-8'>

                            {item.list ? (<NestedList list={item.list} prefix={itemPrefix} />) : null}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default NestedList