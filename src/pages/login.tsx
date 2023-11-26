import type { NextPage } from "next";
import Head from "next/head";
import Header from "~/components/Header";
import { RiArrowRightLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
 
const Login: NextPage = (props) => {
    console.log(props);
    
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
    const userType = _user?.userType?.name === 'Customer' ? 'customer' : 'company';

    // if type is customer and they have an account then take them to the get-quote page
    if (userType === 'customer') {
        if (_user?.id) {
            router.push(`/get-quote`).catch((err) => console.error(err));
        }
    }

    // if type is for a company
    if (_user?.id != null && userType !== 'customer') {
        // if they have a company id redirect them to the company dashboard
        if (_user.companyId) {
            router.push(`/${userType}/${_user?.companyId}`).catch((err) => console.error(err));
            return;
        }
        else {
            // if no company if but we have an account then take them to the company create page
            router.push(`/company/createCompany`).catch((err) => console.error(err));
        }
    }
    
    return (
        <>
            <Head>
                <title>Busing App</title>
                <meta name="description" content="App to manage operators for busing quotes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
                <Header />
                <div className="container text-slate-100 text-4xl">
                    <div className="flex justify-center">
                        <button className="pb-3 border-b border-white hover:border-b-4 transition-all duration-500" onClick={() => router.push('/customer/create')}>Create customer&nbsp;&nbsp;&nbsp;<RiArrowRightLine size={35} className="text-slate-100 inline" /></button>
                    </div>
                    <div className="flex flex-row items-center justify-evenly gap-12 px-4 pt-32">
                        <button className="pb-3 border-b border-white hover:border-b-4 transition-all duration-500" onClick={() => router.push('/company/createUser')}>Create company&nbsp;&nbsp;&nbsp;<RiArrowRightLine size={35} className="text-slate-100 inline" /></button>
                        <button className="pb-3 border-b border-white hover:border-b-4 transition-all duration-500" onClick={() => router.push('/company/existingCompany')}>Join existing company&nbsp;&nbsp;&nbsp;<RiArrowRightLine size={35} className="text-slate-100 inline" /></button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;