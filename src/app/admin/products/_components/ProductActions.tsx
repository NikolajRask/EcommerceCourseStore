'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React, { startTransition, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct, toggleProductAvailability } from '../../_actions/product'

export const ActiveToggleDropdownItem = ({id, isAvailableForPurchase} : { id: string, isAvailableForPurchase: boolean}) => {

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    return (
        <>
            <DropdownMenuItem disabled={isPending} onClick={() => {
                startTransition(async () => {
                    await toggleProductAvailability(id, !isAvailableForPurchase)
                    router.refresh()
                })
            }}>{isAvailableForPurchase ? "Deactivate" : "Activate"}</DropdownMenuItem>
        </>
    )
}

export const DeleteDropdownItem = ({id, disabled} : {id: string, disabled: boolean}) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    return (
        <>
            <DropdownMenuItem disabled={disabled || isPending} onClick={() => {
                startTransition(async () => {
                    await deleteProduct(id)
                    router.refresh()
                })
            }}>Delete</DropdownMenuItem>
        </>
    )
  }


