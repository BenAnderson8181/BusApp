import type { NextPage } from "next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import phoneRegex from "~/utils/phoneValidation";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { AlertInput } from "~/utils/alert";

const companySchema = z
    .object({
        name: z.string().min(2).max(100),
        DOT: z.string().max(50).or(z.literal('')),
        address: z.string().min(4).max(100),
        city: z.string().min(2).max(50),
        stateId: z.string(),
        zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
        country: z.string().min(2).max(50),
        email: z.string().email(),
        website: z.string().url().optional().or(z.literal('')),
        companyPhone: z.string().refine((value) => phoneRegex.test(value)),
        dispatchPhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
        mobilePhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
        ELDId: z.string().optional()
    });

type CompanyFormType = z.infer<typeof companySchema>;

const CompanyCreate: NextPage = (props) => {
    console.log(props)
    
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CompanyFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            DOT: '',
            address: '',
            city: '',
            stateId: '-1',
            zip: '',
            country: '',
            email: '',
            website: '',
            companyPhone: '',
            dispatchPhone: '',
            mobilePhone: '',
            ELDId: ''
        }
    });

    const { user } = useUser();
    console.log(user) // TODO: we need this to authenticate the user
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const createCompanyMutation = api.company.create.useMutation();
    const eldQuery = api.eld.list.useQuery();
    const stateQuery = api.state.list.useQuery();

    if (eldQuery.isLoading || stateQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (eldQuery.isError || stateQuery.isError) {
        return <LoadError type='Page' />
    }

    const elds = eldQuery.data;
    const states = stateQuery.data;

    const onSubmit = async (company: CompanyFormType) => {
        const result = await createCompanyMutation.mutateAsync({
            ...company
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
            return;
        });

        if (result?.id) {
            console.log('company created')
            //router.push('/company/policies/eSignature').catch((err) => console.error(err)); // Push to the policies process start
        }
    }

    const onBack = () => {
        router.push('/').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin mt-5">Create Company</h1>
            <div className="w-1/2 text-start border border-indigo-700 rounded-sm mt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="w-full grid grid-cols-2 gap-x-16 gap-y-3">
                        <label>
                            <div className="text-2xl font-light">Name:</div>
                            <input
                                type="text"
                                placeholder="Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("name")}
                            />
                            <AlertInput type="error">{errors?.name?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">DOT:</div>
                                <input
                                    type="text"
                                    placeholder="DOT"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("DOT")}
                                />
                            <AlertInput type="error">{errors?.DOT?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Address:</div>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
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
                                    {...register("city")}
                                />
                            <AlertInput type="error">{errors?.city?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">State:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("stateId")}
                                aria-invalid={Boolean(errors.stateId)}
                            >
                                <option value="-1">-- Please select a state --</option>
                                {
                                    states?.map(({id, name}) => (
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
                                placeholder="Zip"
                                {...register("zip")}
                                aria-invalid={Boolean(errors.zip)}
                            />
                            <AlertInput type="error">{errors?.zip?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Country:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Country"
                                {...register("country")}
                                aria-invalid={Boolean(errors.country)}
                            />
                            <AlertInput type="error">{errors?.country?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Email:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Email"
                                {...register("email")}
                                aria-invalid={Boolean(errors.email)}
                            />
                            <AlertInput type="error">{errors?.email?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Website:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Website"
                                {...register("website")}
                                aria-invalid={Boolean(errors.website)}
                            />
                            <AlertInput type="error">{errors?.website?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Company Phone:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Company Phone"
                                {...register("companyPhone")}
                                aria-invalid={Boolean(errors.companyPhone)}
                            />
                            <AlertInput type="error">{errors?.companyPhone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Dispatch Phone:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Dispatch Phone"
                                {...register("dispatchPhone")}
                                aria-invalid={Boolean(errors.dispatchPhone)}
                            />
                            <AlertInput type="error">{errors?.dispatchPhone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Mobile Phone:</div>
                            <input
                                type="text"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                placeholder="Mobile Phone"
                                {...register("mobilePhone")}
                                aria-invalid={Boolean(errors.mobilePhone)}
                            />
                            <AlertInput type="error">{errors?.mobilePhone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">ELD:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("stateId")}
                                aria-invalid={Boolean(errors.ELDId)}
                            >
                                <option value="-1">-- Please select an ELD --</option>
                                {
                                    elds?.map(({id, name}) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))
                                }
                            </select>
                            <AlertInput type="error">{errors?.stateId?.message}</AlertInput>
                        </label>
                        <div className="flex justify-start mt-8">
                            <button className="px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onBack}>Back</button>
                            <input
                                type="submit"
                                disabled={isSubmitting || !isDirty || !isValid}
                                className="rounded border border-slate-200 text-slate-200 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                            />
                        </div>
                    </div>
                </form>
            </div>
            { showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the request to save the company.  Please try again or contact us at info@busapp.com</div>
            }
        </div>
    )
}

export default CompanyCreate;