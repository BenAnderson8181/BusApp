import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { AlertInput } from "~/utils/alert";

const vehicleSchema = z.object({
    name: z.string().min(2).max(100),
    vehicleTypeId: z.string(),
    make: z.string().min(2).max(100),
    model: z.string().min(2).max(100),
    year: z.number().int(),
    capacity: z.number().int(),
    vinNumber: z.string().min(2).max(50),
    licensePlate: z.string().min(2).max(50),
    garageId: z.string().optional(),
    wifi: z.boolean(),
    bathroom: z.boolean(),
    ADACompliant: z.boolean(),
    Outlets: z.boolean(),
    alcoholAllowed: z.boolean(),
    luggage: z.boolean(),
    seatBelts: z.boolean(),
    TVScreens: z.boolean(),
    leatherSeats: z.boolean(),
    companyId: z.string(),
    isActive: z.boolean().default(true)
});

    type VehicleFormType = z.infer<typeof vehicleSchema>;

    type Props = {
            vehicleId: string;
            companyId: string; 
            onClose: React.Dispatch<React.SetStateAction<boolean>>;
            onRefresh: () => void;
        }

const Vehicles = ({ vehicleId: vehicleId, companyId, onClose, onRefresh}: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<VehicleFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            companyId: companyId,
        }
    });
    
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const createGarageMutation = api.vehicle.create.useMutation();
    const GarageQuery = api.garage.list.useQuery({companyId:companyId ?? ''});
    const VehicleTypeQuery = api.vehicleType.list.useQuery();
    const VehicleQuery = api.vehicle.findById.useQuery({id:vehicleId ?? ''}, {enabled: vehicleId.length > 0});

    if (VehicleTypeQuery.isLoading || GarageQuery.isLoading || (vehicleId.length > 0 && VehicleQuery.isLoading)) {
        return <Loading type='Modal' />
    }

    if (VehicleTypeQuery.isError || GarageQuery.isLoading || VehicleQuery.isError) {
        return <LoadError type='Modal' />
    }

    const vehicleTypes = VehicleTypeQuery.data;
    const garages = GarageQuery.data;
    const vehicle = VehicleQuery?.data;


    const onSubmit = async (vehicle: VehicleFormType) => {
        const result = await createGarageMutation.mutateAsync({
            ...vehicle
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
            return;
        });

        if (result?.id) {
            onRefresh();
            onClose(false);
        } else {
        }
    }

    const onBack = () => {
        onRefresh();
        onClose(false);
    }

    console.log("isDirty",isDirty);
    console.log("isSubmitting",isSubmitting);
    console.log("isValid",isValid);
    console.log("Form Disabled?",(isSubmitting || !isDirty || !isValid));
    console.log("register",vehicle)
    return (
        <>
            <div className="flex flex-col items-center justify-center text-slate-600">
                <h1 className="text-4xl font-thin mt-5">{vehicleId ? "Edit" : "New"} Vehicle</h1>
                <div className="text-start border border-slate-700  bg-slate-100 rounded-sm mt-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="w-full flex flex-row space-x-10">
                            <div className="w-full flex flex-col space-y-4">
                                <label>
                                    <div className="text-2xl font-light">Assigned Garage:</div>
                                    <select
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.garageId ?? '-1'}
                                        {...register("garageId")}
                                        aria-invalid={Boolean(errors.garageId)}
                                    >
                                        <option value="-1">-- Please select a garage --</option>
                                        {
                                            garages?.map(({id, name}) => (
                                                <option key={id} value={id}>{name}</option>
                                            ))
                                        }
                                    </select>
                                    <AlertInput type="error">{errors?.garageId?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Vehicle Name:</div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.name ?? ''}
                                        {...register("name")}
                                    />
                                    <AlertInput type="error">{errors?.name?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Vehicle Type:</div>
                                    <select
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.vehicleTypeId ?? '-1'}
                                        {...register("vehicleTypeId")}
                                        aria-invalid={Boolean(errors.vehicleTypeId)}
                                    >
                                        <option value="-1">-- Please select a vehicle type --</option>
                                        {
                                            vehicleTypes?.map(({id, name}) => (
                                                <option key={id} value={id}>{name}</option>
                                            ))
                                        }
                                    </select>
                                    <AlertInput type="error">{errors?.vehicleTypeId?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Vehicle Capacity:</div>
                                    <input
                                        type="text"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.capacity ?? ''}
                                        placeholder="Capacity"
                                        {...register("capacity",{valueAsNumber: true})}
                                        aria-invalid={Boolean(errors.capacity)}
                                    />
                                    <AlertInput type="error">{errors?.capacity?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Make:</div>
                                        <input
                                            type="text"
                                            placeholder="Make"
                                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                            defaultValue={vehicle?.make ?? ''}
                                            {...register("make")}
                                        />
                                    <AlertInput type="error">{errors?.make?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Model:</div>
                                        <input
                                            type="text"
                                            placeholder="Model"
                                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                            defaultValue={vehicle?.model ?? ''}
                                            {...register("model")}
                                        />
                                    <AlertInput type="error">{errors?.model?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">Year:</div>
                                    <input
                                        type="text"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.year ?? ''}
                                        placeholder="Year"
                                        {...register("year", {valueAsNumber: true})}
                                        aria-invalid={Boolean(errors.year)}
                                    />
                                    <AlertInput type="error">{errors?.year?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">VIN:</div>
                                    <input
                                        type="text"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.vinNumber ?? ''}
                                        placeholder="VIN"
                                        {...register("vinNumber")}
                                        aria-invalid={Boolean(errors.vinNumber)}
                                    />
                                    <AlertInput type="error">{errors?.vinNumber?.message}</AlertInput>
                                </label>
                                <label>
                                    <div className="text-2xl font-light">License Plate:</div>
                                    <input
                                        type="text"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={vehicle?.licensePlate ?? ''}
                                        placeholder="License Plate"
                                        {...register("licensePlate")}
                                        aria-invalid={Boolean(errors.licensePlate)}
                                    />
                                    <AlertInput type="error">{errors?.licensePlate?.message}</AlertInput>
                                </label>
                            </div>
                            <div className="w-full flex flex-col space-y-8">
                                <label>
                                    <div className="text-2xl font-light">Vehicle Options</div>
                                </label>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Wifi"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.wifi ?? false}
                                        {...register("wifi")} />
                                    <label className="inline-block text-2xl font-light">Wifi</label>
                                    <AlertInput type="error">{errors?.wifi?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Bathroom"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.bathroom ?? false}
                                        {...register("bathroom")} />
                                    <label className="inline-block text-2xl font-light">Bathroom</label>
                                    <AlertInput type="error">{errors?.bathroom?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="ADA Compliant"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.ADACompliant ?? false}
                                        {...register("ADACompliant")} />
                                    <label className="inline-block text-2xl font-light">ADA Compliant</label>
                                    <AlertInput type="error">{errors?.ADACompliant?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Alcohol Allowed"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.alcoholAllowed ?? false}
                                        {...register("alcoholAllowed")} />
                                    <label className="inline-block text-2xl font-light">Alcohol Allowed</label>
                                    <AlertInput type="error">{errors?.alcoholAllowed?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Luggage"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.wifi ?? false}
                                        {...register("luggage")} />
                                    <label className="inline-block text-2xl font-light">Luggage Space</label>
                                    <AlertInput type="error">{errors?.luggage?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Seatbelts"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.seatBelts ?? false}
                                        {...register("seatBelts")} />
                                    <label className="inline-block text-2xl font-light">Seatbelts</label>
                                    <AlertInput type="error">{errors?.seatBelts?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="TV Screens"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.TVScreens ?? false}
                                        {...register("TVScreens")} />
                                    <label className="inline-block text-2xl font-light">TV Screens</label>
                                    <AlertInput type="error">{errors?.TVScreens?.message}</AlertInput>
                                </div>
                                <div className="block w-full">
                                    <input
                                        type="checkbox"
                                        title="Leather Seats"
                                        className="relative float-left h-8 w-8 rounded-full shadow border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultChecked={vehicle?.leatherSeats ?? false}
                                        {...register("leatherSeats")} />
                                    <label className="inline-block text-2xl font-light">Leather Seats</label>
                                    <AlertInput type="error">{errors?.leatherSeats?.message}</AlertInput>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <input
                                        type="hidden"
                                        value={companyId}
                                        {...register("companyId")} />
                                    <button className={`px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer`} onClick={onBack}>Cancel</button>
                                    <input
                                        value={vehicleId ? "Save" : "Create"}
                                        type="submit"
                                        disabled={isSubmitting || !isDirty || !isValid}
                                        className="rounded border border-slate-400 text-slate-400 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                { showErrorAlert &&
                    <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the request to save the vehicle.  Please try again or contact us at info@busapp.com</div>
                }
            </div>
        </>
    )
}

export default Vehicles;