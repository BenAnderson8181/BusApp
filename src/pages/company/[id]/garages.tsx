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
import type { Garage } from "@prisma/client";




const Garages: NextPage = (props) => {
    console.log(props);

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
    const idValue:string = router.query.id as string;

    const GarageQuery = api.garage.list.useQuery({companyId:idValue});
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
        <main className="flex relative min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
            <CompanyHeader />
            <div className="relative h-auto w-2/3 text-slate-200 text-4xl mb-2">
                <h1>Garages</h1>
                <div className="absolute -top-3 right-0 cursor-pointer hover:scale-105 hover:opacity-80">
                    <RiAddBoxFill size='2.5rem' className="text-slate-300 mt-3" onClick={handleGarageModalAdd}/>
                </div>
            </div>
            <div className="relative p-4 h-auto w-2/3 bg-white">
                
                <ul className="max-w divide-y divide-gray-200">
                    {
                    garages?.map((garage:Garage) => {
                        return <li className = "p-3" key={garage.id}>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                                <p className = "text-md font-medium text-gray-900 truncate">
                                    {garage.name} 
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {`${garage.city} - ${garage.address}`}
                                </p>
                            </div>
                            <div className = "inline-flex items-center text-base font-semibold text-gray-900">
                                <RiEditBoxFill size='2.5rem' className="cursor-pointer text-slate-400" onClick={() => handleGarageModalUpdate(garage.id)} />
                            </div>
                        </div>
                        </li>
                    })
                    }
                </ul>
            </div>
        </main>
        <Modal
            onClose={() => setGarageModalIsOpen(false)}
            onRefresh={() => refreshGarages()}
            isOpen={garageModalIsOpen}
        >
            <GarageModal garageId={garageId} companyId={idValue} onClose={() => setGarageModalIsOpen(false)} onRefresh={refreshGarages} />
        </Modal>
        </>
    )
}

export default Garages;