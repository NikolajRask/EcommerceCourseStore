import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components"
import OrderInformation from './components/OrderInformation'

type PurchaseReceiptEmailProps = {
    product: {
        name: string
        imagePath: string
        description: string
    }
    order: {
        id: string
        createdAt: Date,
        pricePaidInCents: number
    },
    downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
    product: { name: "Test Product", imagePath: "/products/5e83c949-023e-4ffa-bd52-8837dda545af-IMG_3515.jpg", description: "Test Product Description"}, 
    order: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000,
    },
    downloadVerificationId: crypto.randomUUID()
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({ product, order, downloadVerificationId }: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <h1>Purchase Receipt</h1>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

