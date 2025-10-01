"use client";

import Image from 'next/image';
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return(
        <header className="py-4">
            <Image
                src="/images/logoTemp.png"
                alt="Logo"
                width={150}
                height={100}
                className="mb-6"
            />
            <span className="">カムカム</span>
            {isHome ? (
                <h1>Home</h1>
            ) : (
                <div>Not Home</div>
            )}
        </header>
    )
}