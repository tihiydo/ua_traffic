"use client"

import { DataTable } from "@/components/ui/custom/data-table"
import { api } from "@/trpc/react"
import { columns } from "./components/columns"
import { env } from "@/env.mjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Translate from "@/components/Translate"
import CopyButton from "./components/copy-button"


const Referralettings = () => {
    const { data: user } = api.user.getMyUser.useQuery()
    const { data: refferals, isLoading } = api.user.getRefferals.useQuery()
    const { data: bonus } = api.fee.getFee.useQuery({ type: "Bonus" })
    // const { data: hasRefferals } = api.user.haveReferrals.useQuery();

    return (<>
        <div className="mb-4">

            <h1 className="text-2xl font-bold mb-4">
                <Translate namespace="Profile.Referral" itemKey="navname" />
            </h1>
            <div className="flex flex-row gap-x-4 flex-wrap gap-y-2">
                <div>
                    <h5 className="mb-2 font-medium">
                        <Translate namespace="Profile.Referral" itemKey="your-link" />:
                    </h5>

                    <div className="flex gap-2 ">
                        <Input
                            disabled
                            value={`https://uatraffic.com/ref/${user?.id}`}
                            className="w-[240px]"
                        />

                        <CopyButton
                            text={`${env.NEXT_PUBLIC_SITE_URL}/ref/${user?.id}`}
                            disabled={!user?.id}
                        />
                    </div>
                </div >
                {
                    typeof bonus === 'number' && <div className="">
                        <h5 className="mb-2 font-medium">
                            <Translate namespace="Profile.Referral" itemKey="your-dep-bonus" />:
                        </h5>
                        <Button
                            size={'icon'}
                            variant={'outline'}
                            className="text-black bg-yellow/80 hover:bg-yellow/80 cursor-default font-content font-thin border-none"
                        >
                            {bonus}%
                        </Button>
                    </div>
                }
            </div >
        </div >

        <DataTable columns={columns} data={refferals || []} isLoading={isLoading} />
    </>)
}

export default Referralettings