import { formatCurrency } from '@/lib/formatters'
import { Column, Row, Section, Text, Img } from '@react-email/components'
import React from 'react'

type OrderInformationProps = {
    order: {
        id: string
        createdAt: Date,
        pricePaidInCents: number
    }
    product: {
        imagePath: string,
        name: string,
        description: string
    }
    downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: 'medium' })

export default function OrderInformation({ order, product, downloadVerificationId }: OrderInformationProps) {
  return (
    <>
        <Section>
            <Row>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Order ID</Text>
                    <Text className="mt-0 mr-4">{order.id}</Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Purchased On</Text>
                    <Text className="mt-0 mr-4">{dateFormatter.format(order.createdAt)}</Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Price Paid</Text>
                    <Text className="mt-0 mr-4">{formatCurrency(order.pricePaidInCents / 100)}</Text>
                </Column>
            </Row>
        </Section>
        <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
            <Img width="100%" alt={product.name} src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}></Img>
            <Row className="mt-8">
                <Column className="align-bottom">
                    <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
                </Column>
            </Row>
        </Section>
    </>
  )
}

