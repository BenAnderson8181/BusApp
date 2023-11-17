import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

const Header: NextPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="h-24 w-full p-6 flex justify-between bg-black fixed top-0 text-slate-100 text-xl">
            <div className="flex justify-start pl-12">
                <Link href="/" className="text-2xl font-thin" passHref>busApp</Link>
            </div>
            <div className="flex justify-evenly w-1/2 translate-y-2">
                <Link href="/rentals" passHref>Charter Bus Rentals</Link>
                <Link href="/shuttles" passHref>Shuttles</Link>
                <div className="relative block cursor-pointer" onMouseLeave={() => setOpen(false)} onMouseEnter={() => setOpen(true)}>
                    Company&nbsp;<RiArrowDownSLine size={20} className="text-slate-100 inline" />
                    { 
                        open &&
                        <div className="absolute top-8 border border-slate-200 shadow-sm shadow-slate-100 px-8 py-3 block bg-black rounded-lg text-xl">
                            <div><Link href="/about-us" passHref>About&nbsp;Us</Link></div>
                            <div><Link href="/careers" passHref>Careers</Link></div>
                            <div><Link href="/blog" passHref>Blog</Link></div>
                            <div><Link href="/inc" passHref>Inc.&nbsp;500</Link></div>
                        </div>
                    }
                </div>
                <Link href="/operators" passHref>Operators</Link>
            </div>
            <div className="flex justify-end">
                    <Link href="/get-quote" className="bg-slate-100 rounded-full px-4 py-2 text-black font-semibold mr-6 hover:bg-slate-300">Get&nbsp;a&nbsp;Quote</Link>
                    <Link href="/login" className="bg-black rounded-full px-6 py-2 text-slate-100 font-semibold border-2 border-slate-100 hover:border-slate-400">Login</Link>
                </div>
            <div className="flex items-center">
                <UserButton />
            </div>
        </div>
    )
}

export default Header;