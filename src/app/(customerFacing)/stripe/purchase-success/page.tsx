import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async ({ searchParams }: { searchParams: {
    payment_intent: string
} }) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)

    if (paymentIntent.metadata.productId == null) return notFound()

    const product = await db.product.findUnique({where: { id: paymentIntent.metadata.productId }})

    if (product == null) return notFound()

    const isSuccess = paymentIntent.status === "succeeded"

    return (
        <>
            <div className="max-w-5xl w-full mx-auto space-y-8">
                <h1 className="text-4xl fomt-bold">
                    {isSuccess ? "Success" : "Purchase Failed"}
                </h1>
                <div className="flex gap-4 items-center">
                    <div className="aspect-video flex-shrink-0 w-1/3 relative">
                        <Image src={product.imagePath} fill alt={product.name} className="object-cover"></Image>
                    </div>
                    <div>
                        <div className="text-lg">
                            {formatCurrency(product.pricePaidInCents / 100)}
                        </div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <div className="line-clamp-3 text-muted-foreground">
                            {product.description}    
                        </div>
                        <Button className="mt-4" size="lg" asChild>
                            {isSuccess ? <DownloadFileLink id={product.id} /> : <Link href={`/products/${product.id}/purchase`}>Try Again</Link>}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

async function DownloadFileLink({ id }: { id: string}) {
    return <a href={`/products/download/${await createDownloadVerification(id)}`}>Download</a>
}

async function createDownloadVerification(productId: string) {
    return (await db.downloadVerification.create({ data: {productId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)}})).id
}

export default SuccessPage
