"use client";

import Image from 'next/image';
import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return(
        <header className="py-4">
            <Link href="/">
                <Image
                    src="/images/logoTemp.png"
                    alt="Logo"
                    width={150}
                    height={100}
                    className="mb-6"
                />
            </Link>
            <span className="">カムカム</span>
            {isHome ? (
                <h1>Home Page</h1>
            ) : (
                <div>Not Home Page</div>
            )}
        </header>
    )
}