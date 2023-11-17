import { NextPage } from "next";
import Head from "next/head";
import Header from "~/components/Header";

const AboutUs: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Bussing App</title>
        <meta name="description" content="App to manage operators for busing quotes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
        <Header />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-slate-100">
          Hello from about us!
        </div>
      </main>
    </>
  );
}

export default AboutUs;