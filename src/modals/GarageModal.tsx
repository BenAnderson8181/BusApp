import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { AlertInput } from "~/utils/alert";

const garageSchema = z
    .object({
        name: z.string().min(2).max(100),
        address: z.string().min(2).max(100),
        city: z.string().min(2).max(50),
        stateId: z.string(),
        zip: z.string().min(2).max(15),
        companyId: z.string(),
        isActive: z.boolean().default(true)
    });
    type GarageFormType = z.infer<typeof garageSchema>;

    type Props = {
            garageId?: string;
            companyId: string;
            onClose: React.Dispatch<React.SetStateAction<boolean>>;
            onRefresh: () => void;
        }

const Garages = ({ garageId, companyId, onClose, onRefresh}: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<GarageFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(garageSchema),
        defaultValues: {
            companyId: companyId,
        }
    });
    
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const createGarageMutation = api.garage.create.useMutation();
    const stateQuery = api.state.list.useQuery();
    const garageQuery = api.garage.findById.useQuery({id:garageId ?? ''}, {enabled: garageId != null})

    if (stateQuery.isLoading || garageQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (stateQuery.isError || garageQuery.isError) {
        return <LoadError type='Page' />
    }

    const states = stateQuery.data;
    const garage = garageQuery?.data;

    if (garage != null)
    {
        console.log('garage loaded', garage)
    }

    const onSubmit = async (garage: GarageFormType) => {
        const result = await createGarageMutation.mutateAsync({
            ...garage
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
            return;
        });

        if (result?.id) {
            console.log('garage created')
            onRefresh();
            onClose(false);
        } else {
            console.log('garage not created')
        }
    }

    const onBack = () => {
        onRefresh();
        onClose(false);
    }

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-600">
                <h1 className="text-4xl font-thin mt-5">{garageId?`Edit ${garageId}`:"Add"} Garage</h1>
                <div className="text-start border border-indigo-700 rounded-sm mt-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="w-full grid gap-x-16 gap-y-3">
                            <label>
                                <div className="text-2xl font-light">Garage Name:</div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    defaultValue={garage?.name ?? ''}
                                    {...register("name")}
                                />
                                <AlertInput type="error">{errors?.name?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">Address:</div>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={garage?.address ?? ''}
                                        {...register("address")}
                                    />
                                <AlertInput type="error">{errors?.address?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">City:</div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={garage?.city ?? ''}
                                        {...register("city")}
                                    />
                                <AlertInput type="error">{errors?.city?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">State:</div>
                                <select
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    defaultValue={garage?.stateId ?? '-1'}
                                    {...register("stateId")}
                                    aria-invalid={Boolean(errors.stateId)}
                                >
                                    <option value="-1">-- Please select a state --</option>
                                    {
                                        states?.map(({id, name}:{id:string, name:string}) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))
                                    }
                                </select>
                                <AlertInput type="error">{errors?.stateId?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">Zip:</div>
                                <input
                                    type="text"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    defaultValue={garage?.zip ?? ''}
                                    placeholder="Zip"
                                    {...register("zip")}
                                    aria-invalid={Boolean(errors.zip)}
                                />
                                <AlertInput type="error">{errors?.zip?.message}</AlertInput>
                            </label>
                            <div className="flex justify-start mt-8">
                                <button className={`px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer`} onClick={onBack}>Cancel</button>
                                <input
                                    value="Add"
                                    type="submit"
                                    disabled={isSubmitting || isDirty || isValid}
                                    className="rounded border border-slate-400 text-slate-400 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                                />
                            </div>
                        </div>
                    </form>
                </div>
                { showErrorAlert &&
                    <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the request to save the company.  Please try again or contact us at info@busapp.com</div>
                }
            </div>
        </>
    )
}

export default Garages;