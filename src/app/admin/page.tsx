import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'
import db from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: { pricePaidInCents: true},
        _count: true
    })

    await wait(500)

    return { 
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}

function wait(duration: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration)
    })
}

async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count() || 0,
        db.order.aggregate({
            _sum: { pricePaidInCents: true }
        })
    ])

    
    return { 
        userCount: userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
    }
}

async function getProductData() {
    const [activeProducts, inactiveProducts] = await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true }}),
        db.product.count({ where: { isAvailableForPurchase: false }})
    ])

    return { activeProducts: activeProducts, inactiveProducts: inactiveProducts}
}

const page = async () => {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} body={formatCurrency(salesData.amount)}></DashboardCard>

            <DashboardCard title="Customers" subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`} body={formatNumber(userData.userCount)}></DashboardCard>

            <DashboardCard title="Active Products" subtitle={`${formatNumber(productData.activeProducts)} Inactive Procucts`} body={formatNumber(productData.inactiveProducts)}></DashboardCard>
        </div>
    )
}

type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
}

function DashboardCard({title, subtitle, body}: DashboardCardProps) {
    return (
        <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{body}</p>
        </CardContent>
      </Card>
    )
}

export default page
