'use client'

import { Input } from '@/components/ui/input'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { Warehouse } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  return (
    <div className="flex flex-grow items-center justify-center px-4">
      <div className='w-full max-w-sm'>
        <SignUp.Root>
          <SignUp.Step name="start">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Warehouse />
                  <h1>Sign up to Simple Goods</h1>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Clerk.Field 
                  name="username"
                  className="flex flex-col gap-2 w-full"
                >
                  <Clerk.Label>Username</Clerk.Label>
                  <Clerk.Input asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                <Clerk.Field 
                  name="emailAdress"
                  className="flex flex-col gap-2 w-full"
                >
                  <Clerk.Label>Email</Clerk.Label>
                  <Clerk.Input type="email" asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                <Clerk.Field 
                  name="password"
                  className="flex flex-col gap-2 w-full"
                >
                  <Clerk.Label>Password</Clerk.Label>
                  <Clerk.Input type="password" asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <SignUp.Action
                  submit
                  asChild
                >
                  <Button className="w-full font-bold text-white cursor-pointer">Sign Up</Button>
                </SignUp.Action>

                <p className="text-center text-sm text-zinc-500">
                  Have an account?{' '}
                  <Clerk.Link
                    navigate="sign-in"
                    className="font-medium underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
                  >
                    Sign In
                  </Clerk.Link>
                </p>

                <Clerk.Connection
                  name="google"
                  className="flex w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-neutral-700 px-3.5 py-1.5 text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/5%)_inset,0_0_0_1px_theme(colors.white/2%)_inset] outline-none hover:bg-gradient-to-b hover:from-white/5 hover:to-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-white active:bg-gradient-to-b active:from-black/20 active:to-black/20 active:text-white/70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 16"
                    className="w-4"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M8.82 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.998.96 11.256 0 8.82 0 4.41 0 .705 3.591.705 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.82Z"
                    />
                  </svg>
                  Login with Google
                </Clerk.Connection>
              </CardFooter>
            </Card>
          </SignUp.Step>

          <SignUp.Step name="continue">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Signup</CardTitle>
              </CardHeader>
              <Clerk.Field 
                  name="username"
                  className="flex flex-col gap-2 w-full"
                >
                  <Clerk.Label>Username</Clerk.Label>
                  <Clerk.Input asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>
              <CardFooter>
                <SignUp.Action submit asChild>
                  <Button className="w-full cursor-pointer font-bold text-white">Continue</Button>
                </SignUp.Action>
              </CardFooter>
            </Card>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  )
}