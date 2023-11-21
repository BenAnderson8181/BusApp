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
        console.log('grefresh called')
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
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000]">
            <CompanyHeader />
            <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80">
                <RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleGarageModalAdd}/>
            </p>
            <div>
                {
                    garages?.map((garage:Garage) => {
                            return <div key={garage.id}>
                                <div className=""> {garage.name} </div>
                                <RiEditBoxFill size='2.5rem' className="cursor-pointer text-slate-100" onClick={() => handleGarageModalUpdate(garage.id)} />
                            </div>
                        })
                    }
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