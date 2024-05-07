'use server'

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"


const fileSchema = z.instanceof(File, { message: "Required"})
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith('image/'))

const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size >  0, "Required"),
    image: imageSchema.refine(file => file.size >  0, "Required")
})

export async function addProduct(prevState: unknown, formData: FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))

    if (result.success) {
        const data = result.data

        await fs.mkdir("products", { recursive: true })
        const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

        await fs.mkdir("public/products", { recursive: true })
        const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

        await db.product.create({
            data: {
                isAvailableForPurchase: false,
                name: data.name,
                description: data.description,
                pricePaidInCents: data.priceInCents,
                filePath: filePath,
                imagePath: imagePath,
            }
        })

        redirect("/admin/products")

    } else {
        return result.error.formErrors.fieldErrors
    }
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
    await db.product.update({ where: { id }, data: { isAvailableForPurchase}})
}

export async function deleteProduct(id: string) {
    const product = await db.product.delete({ where: {id} })
    if (product == null) return notFound()
    
    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)
}