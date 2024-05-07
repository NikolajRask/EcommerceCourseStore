import { Loader2Icon } from 'lucide-react'
import React from 'react'

const loadingAdmin = () => {
  return (
    <div className="flex justify-center">
      <Loader2Icon className="size-24 animate-spin"></Loader2Icon>
    </div>
  )
}

export default loadingAdmin
