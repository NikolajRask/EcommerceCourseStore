import React from 'react'
import PageHeader from '../../_components/pageHeader'
import ProductForm from '../_components/ProductForm'

const NewProductPage = () => {
  return (
    <>
        <PageHeader>
            Add Product
        </PageHeader>

        <ProductForm></ProductForm>
    </>
  )
}

export default NewProductPage
