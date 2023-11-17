import type { NextPage } from "next";
import Head from "next/head";
import Header from "~/components/Header";
import { RiArrowRightLine } from "react-icons/ri";
// import { SignInButton, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
 
const Login: NextPage = (props) => {
    const router = useRouter();
    const { user } = useUser();

    const userId = user?.id ?? '';

    // this needs to look for an exisiting account and if found redirect them to their account page
    const userQuery = api.user.findAccountByExternalId.useQuery({ externalId: userId });

    if (userQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (userQuery.isError) {
        return <LoadError type='Page' />
    }

    const _user = userQuery.data;
    const userType = _user?.userType.name === 'Customer' ? 'customer' : 'company';

    if (_user?.id != null && user)
        router.push(`/${userType}/${_user?.id}`).catch((err) => console.error(err));

    return (
        <>
            <Head>
                <title>Bussing App</title>
                <meta name="description" content="App to manage operators for busing quotes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
                <Header />
                <div className="container flex flex-row items-center justify-evenly gap-12 px-4 py-16 text-slate-100 text-4xl">
                    <button className="pb-3 border-b border-white hover:border-b-4 transition-all duration-500" onClick={() => router.push('/customer/create')}>I&apos;m a customer&nbsp;&nbsp;&nbsp;<RiArrowRightLine size={35} className="text-slate-100 inline" /></button>
                    <button className="pb-3 border-b border-white hover:border-b-4 transition-all duration-500" onClick={() => router.push('/company/create')}>I&apos;m a bus company&nbsp;&nbsp;&nbsp;<RiArrowRightLine size={35} className="text-slate-100 inline" /></button>
                </div>
            </main>
        </>
    );
}

export default Login;