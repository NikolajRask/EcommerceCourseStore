import db from '@/db/db'
import { notFound } from 'next/navigation'
import React from 'react'

const PurchasePage = async ({ params: { id }} : {params: { id : string }}) => {

    const product = db.product.findUnique({ where: { id }})

    if (product == null) return notFound()

    return (
        <h1>Hello World</h1>
    )
}

export default PurchasePage
