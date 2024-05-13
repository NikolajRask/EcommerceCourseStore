import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from "@react-email/components"
import OrderInformation from './components/OrderInformation'

type OrderHistoryEmailProps = {
    orders: {
        id: string
        pricePaidInCents: number
        createdAt: Date
        downloadVerificationId: string
        product: {
            name: string
            imagePath: string
            description: string
        }
    }[]
}

OrderHistoryEmail.PreviewProps = {
    orders: [
        {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            pricePaidInCents: 10000,
            downloadVerificationId: crypto.randomUUID(),
            product: {
                name: "Test",
                imagePath: `d`,
                description: "Description"
            }
        }
    ]
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <h1>Order History</h1>
            {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                    <OrderInformation
                        order={order}
                        product={order.product}
                        downloadVerificationId={order.downloadVerificationId}
                    />
                    {index < orders.length - 1 && <Hr/>}
                </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

