import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Expired = () => {
  return (
    <>
        <h1 className="text-4xl mb-4 text-center mt-72">Download Link Expired :(</h1>
        <div className="flex flex-col w-full items-center mt-10">
          <Button asChild size="lg"> 
              <Link href="/orders">Get New Link</Link>
          </Button>
        </div>
    </>
  )
}

export default Expired
