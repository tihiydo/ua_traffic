import React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { type User } from '@prisma/client';
import { api } from '@/trpc/react';

type Props = {
    user: User
}


const BanButton = (props: Props) => 
{
    const utils = api.useUtils();

    const verifyProcessMutate = api.admin.users.blockUser.useMutation({
        onSuccess: () =>
        {
            utils.admin.users.getUsers.setData(undefined, 
                (prev) => 
                {
                    return prev?.map(u => (u.id === props.user.id) ? {...u, banned:!u.banned} : u)
                }
            )
        }
    });
    return (
        props.user.banned ?
            (
                <Button className="mx-1 font-bold" variant={"success"} onClick={() =>
                {
                    verifyProcessMutate.mutate({id: props.user.id, block: false})
                }}>
        Розблокувати
                </Button>
            )
            :
            (
                <Button className="mx-1 font-bold" variant={"cancel"} onClick={() =>
                {
                    verifyProcessMutate.mutate({id: props.user.id, block: true})
                }}>
        Заблокувати
                </Button>
            )
    )
}

export default BanButton