import type { NextPage } from "next";
import Head from "next/head";
import CompanyHeader from "~/components/CompanyHeader";

const Metrics: NextPage = (props) => {
    console.log(props);
    
    return (
        <>
        <Head>
            <title>Bussing App</title>
            <meta name="description" content="App to manage operators for busing quotes" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
            <CompanyHeader />
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-slate-100">
                Metrics
            </div>
        </main>
        </>
    )
}

export default Metrics;