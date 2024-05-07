'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import React, { ReactNode, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { addProduct, updateProduct } from '../../_actions/product'
import { Product } from '@prisma/client'
import Image from 'next/image'

const ProductForm = ({ product }: {product?: Product | null}) => {
    const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.pricePaidInCents)

  return (
    <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}></Input>
            {error.name && <div className="text-destructive">{error.name}</div>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="priceInCents">Price In Cents</Label>
            <Input type="number" id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)}></Input>
            <div className="text-muted-foreground">{formatCurrency( ( priceInCents || 0) / 100 )}</div>
            {error.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required  defaultValue={product?.description || ""}></Textarea>
            {error.description && <div className="text-destructive">{error.description}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product == null}></Input>
            {product != null && (
                <div className="text-muted-foreground">{product.filePath}</div>
            )}
            {error.file && <div className="text-destructive">{error.file}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product == null}></Input>
            {product != null && (
                <Image src={product.imagePath} height={400} width={400} alt={product.imagePath}></Image>
            )}
            {error.image && <div className="text-destructive">{error.image}</div>}
        </div>
        <SubmitButton>{product == null ? "Create product" : "Update product"}</SubmitButton>
    </form>
  )
}

function SubmitButton({children}: {children: ReactNode}) {
    const { pending } = useFormStatus()
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : children}</Button>
}

export default ProductForm
