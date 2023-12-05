import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import CompanyHeader from "~/components/CompanyHeader";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { RiAddBoxFill, RiEditBoxFill} from "react-icons/ri";
import VehicleModal from "~/modals/ModalVehicle";
import Modal from "~/modals/Modal";
import { useAuthorizePage } from "~/utils/authorize";
import siteName from "~/utils/siteBranding"

const Vehicals: NextPage = (props) => {
    console.log(props);

    useAuthorizePage();

    const[vehicleId, setVehicleId] = useState('');
    const [vehicleModalIsOpen, setVehicleModalIsOpen] = useState(false);

    const handleVehicleModalAdd = () => {
        setVehicleModalIsOpen(true);
    }

    const handleVehicleModalUpdate = (vehicleId:string) => {
        console.log("vehicleID", vehicleId)
        setVehicleId (()=>vehicleId)
        setVehicleModalIsOpen(true);
    }

    const refreshVehicles = async () => {
        await VehicleQuery.refetch();
        setVehicleId (()=>"");
    }

    const router = useRouter();
    const routeCompanyId : string = router.query.id as string;

    const VehicleQuery = api.vehicle.list.useQuery({companyId : routeCompanyId});
    if (VehicleQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (VehicleQuery.isError) {
        return <LoadError type='Page' />
    }

    const vehicles = VehicleQuery.data;
    console.log("vehicles",vehicles);

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
                    <h1>Vehicles</h1>
                    <div className="absolute -top-3 right-0 cursor-pointer hover:scale-105 hover:opacity-80">
                        <RiAddBoxFill size='3rem' className="text-slate-300 mt-3" onClick={handleVehicleModalAdd}/>
                    </div>
                </div>
                <div className="px-4 bg-white rounded-lg">    
                    <ul className="max-w divide-y divide-slate-200">
                        {
                        vehicles?.map((vehicle) => {
                            return <li className = "py-3" key={vehicle.id}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0">
                                    <p className = "text-lg font-medium text-slate-900 truncate">
                                        {vehicle.name} 
                                    </p>
                                    <p className="text-sm text-slate-600 truncate">
                                        {`${vehicle.make} - ${vehicle.model} - ${vehicle.vinNumber}`}
                                    </p>
                                </div>
                                <div className = "inline-flex items-center text-base font-semibold text-slate-900">
                                    <RiEditBoxFill size='2rem' className="cursor-pointer text-slate-500" onClick={() => handleVehicleModalUpdate(vehicle.id)} />
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
            onClose={() => setVehicleModalIsOpen(false)}
            onRefresh={() => refreshVehicles()}
            isOpen={vehicleModalIsOpen}
        >
            <VehicleModal vehicleId={vehicleId} companyId={routeCompanyId} onClose={() => setVehicleModalIsOpen(false)} onRefresh={refreshVehicles} />
        </Modal>
        </>
    )
}


export default Vehicals;