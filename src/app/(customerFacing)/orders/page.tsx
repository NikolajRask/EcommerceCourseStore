'use client'

import { emailOrderHistory } from '@/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'

const page = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, action] = useFormState(emailOrderHistory, {})
  return (
    <>
        <form action={action} className="max-2-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>Enter your email and we will email you your history and download links</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" required name="email" id="email"></Input>
                        {data.error && <div className="text-destructive">{data.error}</div>}
                    </div>
                </CardContent>
                <CardFooter>
                    {data.message ? <p>{data.message}</p> : <SubmitButton></SubmitButton>}
                </CardFooter>
            </Card>
        </form>
    </>
  )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return <Button className="w-full" size="lg" disabled={pending} type="submit" >{ pending ? "Sending..." : "Send" }</Button>
}

export default page
