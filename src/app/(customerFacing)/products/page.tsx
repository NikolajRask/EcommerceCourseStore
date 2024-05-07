import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import db from '@/db/db'
import { cache } from '@/lib/cache'
import React, { Suspense } from 'react'

const getProducts = cache(() => {
    return db.product.findMany({ where: { isAvailableForPurchase: true }, orderBy: {name: "asc"}})
}, ["/products", "getProducts"], {revalidate: 60 * 60 * 24})

const ProductsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Suspense fallback={
        <>
            <ProductCardSkeleton/>
            <ProductCardSkeleton/>
            <ProductCardSkeleton/>
            <ProductCardSkeleton/>
            <ProductCardSkeleton/>         
            <ProductCardSkeleton/>
        </>
    }>
        <ProductsSuspense></ProductsSuspense>
    </Suspense>

</div>
  )
}

async function ProductsSuspense() {
    const products = await getProducts()

    return products.map(product => (
        <ProductCard key={product.id} {...product}></ProductCard>
    ))
}

export default ProductsPage
