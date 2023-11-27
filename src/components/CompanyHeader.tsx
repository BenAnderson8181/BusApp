import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { RiArrowDownSLine } from "react-icons/ri";

const CompanyHeader: NextPage = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const idValue = router.query.id as string;

    return (
            <nav className="h-24 w-full p-6 flex justify-between bg-slate-900 fixed top-0 text-slate-100 text-xl">
                <div className="flex justify-start pl-12">
                    <Link href={`/company/${idValue}`} className="text-2xl font-thin" passHref>Go Florida Charter</Link>
                </div>
                <div className="flex justify-evenly w-1/2 translate-y-2">
                    <Link href={`/company/${idValue}`} passHref>Today</Link>
                    <Link href={`/company/${idValue}/marketplace`} passHref>Marketplace</Link>
                    <Link href={`/company/${idValue}/bookings`} passHref>Bookings</Link>
                    <Link href={`/company/${idValue}/availability`} passHref>Availability</Link>
                    <Link href={`/company/${idValue}/metrics`} passHref>Metrics</Link>
                    <div className="relative block cursor-pointer" onMouseLeave={() => setOpen(false)} onMouseEnter={() => setOpen(true)}>
                        More&nbsp;<RiArrowDownSLine size={20} className="text-slate-100 inline" />
                        { 
                            open &&
                            <div className="absolute top-8 border border-slate-200 shadow-sm shadow-slate-100 px-8 py-3 block bg-black rounded-lg text-xl">
                                <div><Link href={`/company/${idValue}/vehicals`} passHref>Vehicals</Link></div>
                                <div><Link href={`/company/${idValue}/garages`} passHref>Garages</Link></div>
                                <div><Link href={`/company/${idValue}/team`} passHref>Team</Link></div>
                                <div><Link href={`/company/${idValue}/rates`} passHref>Rates</Link></div>
                                <div><Link href={`/company/${idValue}/information`} passHref>Company</Link></div>
                            </div>
                        }
                    </div>
                    <Link href="/operators" passHref>Operators</Link>
                </div>
                <div className="flex items-center">
                    <UserButton />
                </div>
            </nav>
    )
}

export default CompanyHeader;