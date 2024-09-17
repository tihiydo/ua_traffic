'use client'
 
import { useSearchParams } from 'next/navigation'
import Table from './_components/table'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

const MyRequestsPage = async () => 
{
    const searchParams = useSearchParams()
    const t = useTranslations("Errors");
    const error = searchParams.get('error')
    
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