'use client'

import Select, { type FormSelectItem } from '@/components/select'
import { api } from '@/trpc/react';

type Props = {
    onChange: (value?: string) => void;
    value?: string;
}

const RequisitesSelect = ({ onChange, value }: Props) => {
    const { data: requisites = [], isLoading } = api.requisites.getMyRequisites.useQuery();

    const items: FormSelectItem[] = requisites.map((requisite) => ({
        value: requisite.cardNumber,
        displayValue: <p>{requisite.cardNumber}</p>
    }))

    return (
        <Select
            value={value}
            onChange={onChange}
            isLoading={isLoading}
            items={items}
        />
    )
}

export default RequisitesSelect