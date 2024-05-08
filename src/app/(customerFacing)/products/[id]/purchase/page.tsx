import db from '@/db/db'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from "stripe"
import CheckoutForm from './_components/CheckoutForm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const PurchasePage = async ({ params: { id }} : {params: { id : string }}) => {

    const product = await db.product.findUnique({ where: { id }})

    if (product == null) return notFound()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.pricePaidInCents,
        currency: "USD",
        metadata: { productId: product.id },
    })

    if (paymentIntent.client_secret == null) {
        throw Error("Stripe failed to create a client secret")
    }


    return (
        <CheckoutForm product={product} clientSecret={paymentIntent.client_secret}/>
    )
}

export default PurchasePage
