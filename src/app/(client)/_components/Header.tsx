'use client';

import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const session = useSession();
    console.log('session', session);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Best Selling', href: '/best-selling' },
        { label: 'Offers', href: '/offers' },
        { label: 'Orders', href: '/account/orders' },
    ];

    return (
        <header className="">
            <nav className="flex h-16 items-center justify-center">
                <ul className="flex items-center justify-center gap-6">
                    {navItems.map((item) => (
                        <li
                            key={item.href}
                            className={cn(
                                'text-amber-600 underline-offset-4 transition-all hover:cursor-pointer hover:text-amber-900 hover:underline',
                                pathname === item.href && 'font-semibold text-amber-900 underline'
                            )}>
                            <Link href={item.href}>{item.label}</Link>
                        </li>
                    ))}
                    <li className="text-amber-600 underline-offset-4 transition-all hover:cursor-pointer hover:text-amber-900 hover:underline">
                        {session.status === 'authenticated' ? (
                            <button onClick={() => signOut()}>Logout</button>
                        ) : (
                            <Link href="/api/auth/signin"> Sign in</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}