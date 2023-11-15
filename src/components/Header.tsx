import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";

const Header: NextPage = () => {
    return (
        <div className="h-32 w-full p-6 flex justify-between opacity-80">
            <div className="flex items-center">
                <h1 className="text-2xl font-thin">Menu</h1>
            </div>
            <div className="flex justify-start -translate-x-16">
                <h1 className="text-2xl font-thin">Logo</h1>
            </div>
            <div className="flex items-center">
                <UserButton />
            </div>
        </div>
    )
}

export default Header;