import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import Link from 'next/link'
import Container from './Container'
import { ModeToggle } from './ModeToggle'
import { Warehouse } from 'lucide-react'

export default function Header() {
    return (
        <header className="mt-4">
            <Container>
                <div className='flex justify-between items-center gap-4 pt-4'>
                    <div className='flex items-center gap-4'>
                        <Warehouse />
                        <p className="font-bold">
                            <Link href="/">Simple Goods</Link>
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <ModeToggle />
                        <span className='text-slate-400'>|</span>
                        <div>
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    )
}