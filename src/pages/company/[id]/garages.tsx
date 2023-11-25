import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import CompanyHeader from "~/components/CompanyHeader";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { RiAddBoxFill, RiEditBoxFill} from "react-icons/ri";
import GarageModal from "~/modals/GarageModal";
import Modal from "~/modals/Modal";
import { useAuthorizePage } from "~/utils/authorize";

const Garages: NextPage = (props) => {
    console.log(props);

    useAuthorizePage();

    const[garageId, setGarageId] = useState('');
    const [garageModalIsOpen, setGarageModalIsOpen] = useState(false);

    const handleGarageModalAdd = () => {
        setGarageModalIsOpen(true);
    }

    const handleGarageModalUpdate = (garageId:string) => {
        setGarageId (()=>garageId)
        setGarageModalIsOpen(true);
    }

    const refreshGarages = async () => {
        await GarageQuery.refetch();
        setGarageId (()=>"");
    }

    const router = useRouter();
    const routeCompanyId:string = router.query.id as string;

    const GarageQuery = api.garage.list.useQuery({companyId:routeCompanyId});
    if (GarageQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (GarageQuery.isError) {
        return <LoadError type='Page' />
    }

    const garages = GarageQuery.data;

    return (
        <>
        <Head>
            <title>Bussing App</title>
            <meta name="description" content="App to manage operators for busing quotes" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-1 min-h-screen flex-col items-center justify-left bg-gradient-to-b from-slate-800 to-slate-900">
            <CompanyHeader />
            <div className="h-24" />
            <div className="max-w-4xl w-full mt-4">
                <div className="relative text-slate-200 text-4xl mb-2">
                    <h1>Garages</h1>
                    <div className="absolute -top-3 right-0 cursor-pointer hover:scale-105 hover:opacity-80">
                        <RiAddBoxFill size='2.5rem' className="text-slate-300 mt-3" onClick={handleGarageModalAdd}/>
                    </div>
                </div>
                <div className="px-4 bg-white">    
                    <ul className="max-w divide-y divide-slate-200">
                        {
                        garages?.map((garage) => {
                            return <li className = "py-3" key={garage.id}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0">
                                    <p className = "text-lg font-medium text-slate-900 truncate">
                                        {garage.name} 
                                    </p>
                                    <p className="text-sm text-slate-600 truncate">
                                        {`${garage.state.name} - ${garage.city} - ${garage.address}`}
                                    </p>
                                </div>
                                <div className = "inline-flex items-center text-base font-semibold text-slate-900">
                                    <RiEditBoxFill size='2rem' className="cursor-pointer text-slate-500" onClick={() => handleGarageModalUpdate(garage.id)} />
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
            onClose={() => setGarageModalIsOpen(false)}
            onRefresh={() => refreshGarages()}
            isOpen={garageModalIsOpen}
        >
            <GarageModal garageId={garageId} companyId={routeCompanyId} onClose={() => setGarageModalIsOpen(false)} onRefresh={refreshGarages} />
        </Modal>
        </>
    )
}

export default Garages;