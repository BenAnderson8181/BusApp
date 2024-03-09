import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import CompanyHeader from "~/components/CompanyHeader";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { RiAddBoxFill, RiEditBoxFill} from "react-icons/ri";
import RateModal from "~/modals/ModalRate";
import Modal from "~/modals/Modal";
import { useAuthorizePage } from "~/utils/authorize";
import siteName from "~/utils/siteBranding";

const Rates: NextPage = (props) => {
    console.log(props);

    useAuthorizePage();

    const[rateId, setRateId] = useState('');
    const [rateModalIsOpen, setRateModalIsOpen] = useState(false);

    const handleRateModalAdd = () => {
        setRateModalIsOpen(true);
    }

    const handleRateModalUpdate = (rateId:string) => {
        setRateId (()=>rateId)
        setRateModalIsOpen(true);
    }

    const refreshRates = async () => {
        await RateQuery.refetch();
        setRateId (()=>"");
    }

    const router = useRouter();
    const routeCompanyId:string = router.query.id as string;

    const RateQuery = api.rate.list.useQuery({companyId:routeCompanyId});
    if (RateQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (RateQuery.isError) {
        return <LoadError type='Page' />
    }

    const rates = RateQuery.data;
    //console.log("Rates: ",rates, "Company: ", routeCompanyId);
    return (
        <>
        <Head>
            <title>{siteName}</title>
            <meta name="description" content="App to manage operators for busing quotes" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-1 min-h-screen flex-col items-center justify-left bg-gradient-to-b from-slate-800 to-slate-900">
            <CompanyHeader />
            <div className="h-24" />
            <div className="max-w-4xl w-full mt-4">
                <div className="relative text-slate-200 text-4xl mb-2">
                    <h1>Rates</h1>
                    <div className="absolute -top-3 right-0 cursor-pointer hover:scale-105 hover:opacity-80">
                        <RiAddBoxFill size='3rem' className="text-slate-300 mt-3" onClick={handleRateModalAdd}/>
                    </div>
                </div>
                <div className="px-4 bg-white rounded-lg">    
                    <ul className="max-w divide-y divide-slate-200">
                        {
                        rates?.map((rate) => {
                            return <li className = "py-3" key={rate.id}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0">
                                    <p className = "text-lg font-medium text-slate-900 truncate">
                                        {rate.name} 
                                    </p>
                                    <p className="text-sm text-slate-600 truncate">
                                    Transfer: $ {Number(rate.transfer).toFixed(2)} <br/> Dead Mile: ${Number(rate.deadMile).toFixed(2)} --- Live Mile: ${Number(rate.liveMile).toFixed(2)} <br/> Hourly: ${Number(rate.hourly).toFixed(2)} --- Daily: ${Number(rate.daily).toFixed(2)}
                                    </p>
                                </div>
                                <div className = "inline-flex items-center text-base font-semibold text-slate-900">
                                    <RiEditBoxFill size='2rem' className="cursor-pointer text-slate-500" onClick={() => handleRateModalUpdate(rate.id)} />
                                </div>
                            </div>
                            </li>
                        })
                        }
                    </ul>
                </div>
            </div>
        </main>
        <Modal
            onClose={() => setRateModalIsOpen(false)}
            onRefresh={() => refreshRates()}
            isOpen={rateModalIsOpen}
        >
            <RateModal rateId={rateId} companyId={routeCompanyId} onClose={() => setRateModalIsOpen(false)} onRefresh={refreshRates} />
        </Modal>
        </>
    )
}

export default Rates;