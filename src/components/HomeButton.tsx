import Link from "next/link";
import { RiHome4Line } from "react-icons/ri";

const HomeButton = () => {
    return (
        <Link href='/signInRedirect' passHref><RiHome4Line size={50} className="text-slate-100" /></Link>
    )
}

export default HomeButton;