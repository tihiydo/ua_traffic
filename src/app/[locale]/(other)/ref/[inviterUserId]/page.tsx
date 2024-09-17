"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

type Props = 
{
    params: { inviterUserId: string }
}

type refItem =
{
    inviterUserId: string
    date: string
}

const RedirectToAuth = (props: Props) => 
{
    useEffect(()=>{
        const refItemCreated : refItem = 
        {
            inviterUserId: props.params.inviterUserId,
            date: new Date().toString()
        }
        localStorage.setItem("refItem", JSON.stringify(refItemCreated))
        redirect("/sign-up")

    },[])

}

export default RedirectToAuth