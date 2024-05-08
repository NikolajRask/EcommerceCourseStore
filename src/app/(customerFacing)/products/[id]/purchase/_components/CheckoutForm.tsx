'use client'

import React, { FormEvent, useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userOrderExists } from '@/app/_actions/orders';

type CheckoutFormProps = {
    product: {
        id: string
        imagePath: string
        name: string
        pricePaidInCents: number
        description: string
    }
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  return (
    <>
        <div className="max-w-5xl w-full mx-auto space-y-8">
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
                </div>
            </div>
            <Elements options={{ clientSecret }} stripe={stripePromise}>
                <Form pricePaidInCents={product.pricePaidInCents} productId={product.id}></Form>
            </Elements>
        </div>
    </>
  )
}


function Form({ pricePaidInCents, productId }: { pricePaidInCents: number, productId: string}) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<String>()
    const [email, setEmail] = useState<String>()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (stripe == null || elements == null || email == null) return

        setIsLoading(true)

        const orderExists = await userOrderExists(email as string, productId)

        if (orderExists) {
            setErrorMessage("You have already purchased this product. Try downloading it from the My Orders page")
            setIsLoading(false)
            return
        }

        stripe.confirmPayment({ elements, confirmParams: { 
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL as string}/stripe/purchase-success`
        }}).then(({ error }) => {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message as string)
            } else {
                setErrorMessage("Something went wrong, please try again later")
            }
        }).finally(() => setIsLoading(false))
    }

    return <> 
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                    {errorMessage && <CardDescription className="text-destructive">{errorMessage}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <PaymentElement/>
                    <div className="mt-4">
                        <LinkAuthenticationElement onChange={e => setEmail(e.value.email)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" disabled={stripe == null || elements == null || isLoading}>
                        {isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(pricePaidInCents/100)}`}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </>
}

export default CheckoutForm
