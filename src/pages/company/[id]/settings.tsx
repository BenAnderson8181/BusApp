import type { NextPage } from "next";
import Head from "next/head";
import CompanyHeader from "~/components/CompanyHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import phoneRegex from "~/utils/phoneValidation";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { AlertInput } from "~/utils/alert";
import { useUser } from "@clerk/nextjs";

const companySchema = z
    .object({
        name: z.string().min(2, { message: 'Company name must be at least 2 characters'}).max(100, { message: 'Company name must be no longer then 100 characters'}),
        DOT: z.string().max(50).or(z.literal('')),
        address: z.string().min(4, { message: 'Address must be at least 2 characters'}).max(100, { message: 'Address must be no longer then 100 characters'} ),
        city: z.string().min(2, { message: 'City must be at least 2 characters' }).max(50, { message: 'City must be no longer then 50 characters' }),
        stateId: z.string().min(4, { message: 'Selecing a state is required' }),
        zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
        country: z.string().min(2, { message: 'Country must be at least 2 characters' }).max(50, { message: 'Country must be no longer then 50 characters' }),
        email: z.string().email({ message: 'A valid email is required' }),
        website: z.string().url().optional().or(z.literal('')),
        companyPhone: z.string().refine((value) => phoneRegex.test(value), { message: 'A valid phone number is required.' }),
        dispatchPhone: z.union([z.string(), z.string().refine((value) => phoneRegex.test(value ?? ''))]).optional(),
        mobilePhone: z.union([z.string(), z.string().refine((value) => phoneRegex.test(value ?? ''))]).optional(),
        ELDId: z.string().optional()
    });

type CompanyFormType = z.infer<typeof companySchema>;

const Information: NextPage = (props) => {
    console.log("props", props);

    const { register, handleSubmit, /*watch,*/ formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CompanyFormType>({
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

    // const formWatch = watch();

    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const userId = user?.id ?? '';
    const CompanyId:string = router.query.id as string;

    if (userId.length === 0) {
        console.error('no user found');
        return <LoadError type='Page' />
    }

    const createCompanyMutation = api.company.create.useMutation();
    const updateUserMutation = api.user.updateCompanyId.useMutation();
    const eldQuery = api.eld.list.useQuery();
    const stateQuery = api.state.list.useQuery();
    const companyQuery = api.company.findById.useQuery({id: CompanyId});
    

    if (eldQuery.isLoading || stateQuery.isLoading || companyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (eldQuery.isError || stateQuery.isError || companyQuery.isLoadingError) {
        return <LoadError type='Page' />
    }

    const elds = eldQuery.data;
    const states = stateQuery.data;
    const company = companyQuery?.data;
    console.log("--Company--", company ?? '');

    /*
    const companyQuery = api.company.findById.useQuery({id: _companyId});

    if (companyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (companyQuery.isError) {
        return <LoadError type='Page' />
    }

    console.log("--Company--", companyQuery.data ?? '')
*/
    const onSubmit = async (company: CompanyFormType) => {
        
    }

    const onBack = () => {
        router.push('/').catch((err) => console.error(err));
    }

    return (
        <>
        <Head>
            <title>Bussing App</title>
            <meta name="description" content="App to manage operators for busing quotes" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
            <CompanyHeader />
            <div className="relative text-slate-200 text-4xl mb-2">
                    <h1>{company?.name ?? ''}</h1>
                </div>
            <div className="w-3/4 text-start border border-slate-100 rounded-lg bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="w-full grid grid-cols-3 gap-x-16 gap-y-3">
                        <label>
                            <div className="text-2xl font-light">Name:</div>
                            <input
                                type="text"
                                placeholder="Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                defaultValue={company?.name ?? ''}
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
                                    defaultValue={company?.DOT ?? ''}
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
                                    defaultValue={company?.address ?? ''}
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
                                    defaultValue={company?.city ?? ''}
                                    {...register("city")}
                                />
                            <AlertInput type="error">{errors?.city?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">State:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                defaultValue={company?.stateId ?? '-1'}
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
                                defaultValue={company?.zip ?? ''}
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
                                defaultValue={company?.email ?? ''}
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
                                defaultValue={company?.website ?? ''}
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
                                defaultValue={company?.companyPhone ?? ''}
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
                                defaultValue={company?.dispatchPhone ?? ''}
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
                                defaultValue={company?.mobilePhone ?? ''}
                                {...register("mobilePhone")}
                                aria-invalid={Boolean(errors.mobilePhone)}
                            />
                            <AlertInput type="error">{errors?.mobilePhone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">ELD:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                defaultValue={company?.ELDId ?? '-1'}
                                {...register("ELDId")}
                                aria-invalid={Boolean(errors.ELDId)}
                            >
                                <option value="-1">-- Please select an ELD --</option>
                                {
                                    elds?.map(({id, name}) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))
                                }
                            </select>
                            <AlertInput type="error">{errors?.ELDId?.message}</AlertInput>
                        </label>
                        <div></div>
                        <div className="flex justify-start mt-8">
                            <button className="px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onBack}>Cancel</button>
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
        </main>
        </>
    )
}

export default Information;