'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import React, { useState } from 'react'
import { addProduct } from '../../_actions/product'
import { useFormStatus } from 'react-dom'

const ProductForm = () => {
    const [priceInCents, setPriceInCents] = useState<number>()

  return (
    <form action={addProduct} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required></Input>
        </div>

        <div className="space-y-2">
            <Label htmlFor="priceInCents">Price In Cents</Label>
            <Input type="number" id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)}></Input>
            <div className="text-muted-foreground">{formatCurrency( ( priceInCents || 0) / 100 )}</div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required></Textarea>
        </div>
        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required></Input>
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required></Input>
        </div>
        <SubmitButton></SubmitButton>
    </form>
  )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Create Product"}</Button>
}

export default ProductForm
