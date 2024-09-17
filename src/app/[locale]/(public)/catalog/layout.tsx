
import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react'

type Props = {
    children: React.ReactNode;
    params: { locale: string }
}

const CatalogLaout = ({ children, params }: Props) => {
    unstable_setRequestLocale(params.locale);

    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default CatalogLaout