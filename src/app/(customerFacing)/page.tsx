import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { cache } from '@/lib/cache'
import { Product } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'

const getMostPopularProducts = cache(() => {
    return db.product.findMany({
        where: {isAvailableForPurchase: true}, 
        orderBy: { orders: { _count: "desc"}},
        take: 6
    })
}, ["/", "getMostPopularProduct"], {revalidate: 60 * 60 * 24})

const getNewestProducts = cache(() => {
    return db.product.findMany({
        where: {isAvailableForPurchase: true}, 
        orderBy: { createdAt: "desc"},
        take: 6
    })
}, ["/", "getNewestProducts"], {revalidate: 60 * 60 * 24})



// function wait(duration: number) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, duration)
//     })
// }

const HomePage = () => {
  return (
    <main className="space-y-12">
        <ProductGridSection title="Most Popular" productsFetcher={getMostPopularProducts}></ProductGridSection>
        <ProductGridSection title="Newest" productsFetcher={getNewestProducts}></ProductGridSection>
    </main>
  )
}

type ProductGridSectionProps = {
    productsFetcher: () => Promise<Product[]>
    title: string
}

function ProductGridSection({productsFetcher, title}: ProductGridSectionProps) {
    return (

        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button variant="outline" asChild>
                    <Link href="/products" className="space-x-2">
                        <span>View All</span>
                        <ArrowRight className='size-4'></ArrowRight>
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense fallback={
                    <>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                    </>
                }>
                    <ProductSuspense productsFetcher={productsFetcher}></ProductSuspense>
                </Suspense>

            </div>
        </div>

    )
}

async function ProductSuspense({productsFetcher} : {productsFetcher: () => Promise<Product[]>}) {
    return <>
        {(await productsFetcher()).map(product => (
            <ProductCard key={product.id} {...product}></ProductCard>
        ))}
    </>
}

export default HomePage

