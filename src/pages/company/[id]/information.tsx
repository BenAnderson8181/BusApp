import type { NextPage } from "next";
import Head from "next/head";
import CompanyHeader from "~/components/CompanyHeader";

const Information: NextPage = (props) => {
    console.log(props);
    
    return (
        <>
        <Head>
            <title>Bussing App</title>
            <meta name="description" content="App to manage operators for busing quotes" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
            <CompanyHeader />
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-slate-100">
                Information
            </div>
        </main>
        </>
    )
}

export default Information;