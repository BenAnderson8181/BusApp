import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { api } from "~/utils/api";
import { AlertInput } from "~/utils/alert";

const rateSchema = z
    .object({
        name: z.string().min(2).max(100),
        transfer: z.number(),
        deadMile: z.number(),
        liveMile: z.number(),
        hourly: z.number(),
        minimumHours: z.number().int(),
        daily: z.number(),
        companyId: z.string()
    });
    type RateFormType = z.infer<typeof rateSchema>;

    type Props = {
            rateId: string;
            companyId: string;
            onClose: React.Dispatch<React.SetStateAction<boolean>>;
            onRefresh: () => void;
        }

const Rates = ({ rateId, companyId, onClose, onRefresh}: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<RateFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(rateSchema),
        defaultValues: {
            companyId: companyId,
        }
    });
    
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const createRateMutation = api.rate.create.useMutation();
    const updateRateMutation = api.rate.update.useMutation();
    const stateQuery = api.state.list.useQuery();
    const rateQuery = api.rate.findById.useQuery({id:rateId ?? ''}, {enabled: rateId.length > 0})

    if (stateQuery.isLoading || (rateId.length > 0 && rateQuery.isLoading)) {
        return <Loading type='Modal' />
    }

    if (stateQuery.isError || rateQuery.isError) {
        return <LoadError type='Modal' />
    }

    const states = stateQuery.data;
    const rate = rateQuery?.data;

    const onSubmit = async (rate: RateFormType) => {

        if (rateId === "")
        {
            const result = await createRateMutation.mutateAsync({
                ...rate
            })
            .catch((err) => {
                setShowErrorAlert(true);
                console.error(err);
                return;
            });

            if (result?.id) {
                onRefresh();
                onClose(false);
            }
        } else {
            console.log("rate-->", rateId, rate);
            const result = await updateRateMutation.mutateAsync({
                id:rateId, ...rate
            })
            .catch((err) => {
                setShowErrorAlert(true);
                console.error(err);
                return;
            });

            if (result?.id) {
                rateQuery.refetch();
                onRefresh();
                onClose(false);
            }
        }
    }

    const onBack = () => {
        onRefresh();
        onClose(false);
    }
    //console.log("Disabled", isSubmitting, !isDirty, !isValid);
    return (
        <>
            <div className="flex flex-col items-center justify-center text-slate-600">
                <h1 className="text-4xl font-thin mt-5">{rateId ? "Edit" : "New"} Rate</h1>
                <div className="text-start border border-slate-700  bg-slate-100 rounded-sm mt-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="w-full grid gap-x-16 gap-y-3">
                            <label>
                                <div className="text-2xl font-light">Rate Name:</div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    defaultValue={rate?.name ?? ''}
                                    {...register("name")}
                                />
                                <AlertInput type="error">{errors?.name?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">transfer:</div>
                                    <input
                                        type="text"
                                        placeholder="transfer"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.transfer.toString() ?? ''}
                                        {...register("transfer", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.transfer?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">deadMile:</div>
                                    <input
                                        type="text"
                                        placeholder="deadMile"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.deadMile.toString() ?? ''}
                                        {...register("deadMile", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.deadMile?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">liveMile:</div>
                                    <input
                                        type="text"
                                        placeholder="liveMile"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.liveMile.toString() ?? ''}
                                        {...register("liveMile", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.liveMile?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">hourly:</div>
                                    <input
                                        type="text"
                                        placeholder="hourly"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.hourly.toString() ?? ''}
                                        {...register("hourly", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.hourly?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">minimumHours:</div>
                                    <input
                                        type="text"
                                        placeholder="minimumHours"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.minimumHours.toString() ?? ''}
                                        {...register("minimumHours", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.transfer?.message}</AlertInput>
                            </label>
                            <label>
                                <div className="text-2xl font-light">daily:</div>
                                    <input
                                        type="text"
                                        placeholder="daily"
                                        className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                        defaultValue={rate?.daily.toString() ?? ''}
                                        {...register("daily", {valueAsNumber: true})}
                                    />
                                <AlertInput type="error">{errors?.transfer?.message}</AlertInput>
                            </label>
                            <div className="flex justify-start mt-8">
                                <button className={`px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer`} onClick={onBack}>Cancel</button>
                                <input
                                    value={rateId ? "Save" : "Create"}
                                    type="submit"
                                    disabled={isSubmitting || !isDirty || !isValid}
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

export default Rates;