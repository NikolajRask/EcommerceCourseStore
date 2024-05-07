import React from 'react'
import PageHeader from '../_components/pageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const AdminProductsPage = () => {
  return (
    <>
        <div className="flex justify-between items-center gap-4">
            <PageHeader>Products</PageHeader>
            <Button>
                <Link href="/admin/products/new">Add Product</Link>
            </Button>
        </div>
        <ProductsTable></ProductsTable>
    </>
  )
}

function ProductsTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0">
                        <span className="sr-only">Available For Purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
        </Table>    
    )
}

export default AdminProductsPage
