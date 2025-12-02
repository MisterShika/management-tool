"use client";

import Image from 'next/image';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return(
        <header className="py-4 text-center w-full bg-yellow-400 mb-6 border-b border-yellow-500">
            <Link href="/">
                <Image
                    src="/images/logoMain.png"
                    alt="Logo"
                    width={150}
                    height={100}
                    className="mb-1 block mx-auto"
                />
            </Link>
            <h1 className="inline-block text-4xl font-bold -rotate-5">カムカム</h1>
            {/* {isHome ? (
                <h1>Home Page</h1>
            ) : (
                <div>Not Home Page</div>
            )} */}
            <LogoutButton />
        </header>
    )
}