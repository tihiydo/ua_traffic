"use client"

import { useSearchParams } from 'next/navigation'
import Table from './_components/table'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

const MyRequestsPage = () => {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const t = useTranslations("Errors");

    useEffect(() =>
    {
        if(error !== null)
        {
            toast.error(t(error))
        }
    }, [error])

    return (
        <>
            <Table />
        </>
    )
}

export default MyRequestsPage