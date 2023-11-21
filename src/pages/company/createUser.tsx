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
import Header from "~/components/Header";

const userSchema = z
    .object({
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
        email: z.string().email(),
        isDriver: z.boolean(),
        phone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
        drugTestNumber: z.string().optional(),
        drugTestExpirationMonth: z.string().optional(),
        drugTestExpirationYear: z.number().int().optional(),
        licenseNumber: z.string().optional(),
        stateId: z.string(),
        licenseExpirationMonth: z.string().optional(),
        licenseExpirationYear: z.number().optional(),
        notes: z.string().optional(),
    });

type UserFormType = z.infer<typeof userSchema>;

const UserCreate: NextPage = (props) => {
    console.log(props);

    const { user } = useUser(); 
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [isDriver, setIsDriver] = useState(false);

    const userId = user?.id ?? '';

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<UserFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            isDriver: false,
        }
    });

    if (userId.length === 0) {
        console.error('no user found');
        return <LoadError type='Page' />
    }

    const createUserMutation = api.user.create.useMutation();
    const userTypeQuery = api.userType.list.useQuery();
    const stateQuery = api.state.list.useQuery();
    const userAccountQuery = api.user.findAccountByExternalId.useQuery({ externalId: userId });

    if (userTypeQuery.isLoading || stateQuery.isLoading || userAccountQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (userTypeQuery.isError || stateQuery.isError || userAccountQuery.isError) {
        console.error('failed to load user types');
        return <LoadError type='Page' />
    }

    const userTypeId = userTypeQuery.data.find(t => t.name === 'User')?.id ?? '';
    const states = stateQuery.data;
    const userAccount = userAccountQuery.data;

    // Check if a user account exists without a company id set and if so skip user account creation and navaigate to create company
    if (userAccount) {
        if (userAccount.companyId?.length === 0 || userAccount.companyId == null) {
            router.push('/company/createCompany').catch((err) => console.error(err));
        }
    }

    if (userTypeId?.length === 0) {
        console.error('failed to find id user type "User"');
        return <LoadError type='Page' />
    }

    const onSubmit = async (user: UserFormType) => {
        const result = await createUserMutation.mutateAsync({
            ...user,
            userTypeId,
            externalId: userId,
        })
        .catch((err) => {
            setShowError(true);
            console.error(err);
            return;
        });

        // TODO: add required policies here        

        // TODO: add welcome email here

        if (result?.id) {
            router.push('/company/createCompany').catch((err) => console.error(err));
        }
    }

    const onBack = () => {
        router.push('/').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000] text-slate-100">
            <Header />
            <h1 className="text-3xl font-thin justify-center flex mb-4 italic">Create User</h1>
            <div className="w-3/4 text-start border border-slate-100 rounded-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="w-full grid grid-cols-3 gap-x-16 gap-y-3">
                        <label>
                            <div className="text-2xl font-light">First Name:</div>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("firstName")}
                            />
                            <AlertInput type="error">{errors?.firstName?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Last Name:</div>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("lastName")}
                            />
                            <AlertInput type="error">{errors?.lastName?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Email:</div>
                            <input
                                type="text"
                                placeholder="Email"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("email")}
                            />
                            <AlertInput type="error">{errors?.email?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Phone:</div>
                            <input
                                type="text"
                                placeholder="Phone"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("phone")}
                            />
                            <AlertInput type="error">{errors?.phone?.message}</AlertInput>
                        </label>
                        <label className="pt-6">
                            <div className="text-2xl font-light inline">Is Driver:</div>
                            <input
                                type="checkbox"
                                className="rounded-md border w-10 border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                onChange={() => setIsDriver(!isDriver)}
                            />
                        </label>
                        <div></div>
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">Drug Test Number:</div>
                                <input
                                    type="text"
                                    placeholder="Drug Test Number"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("drugTestNumber")}
                                />
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">Drug Test Expiration Month:</div>
                                <select
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("drugTestExpirationMonth")}
                                    aria-invalid={Boolean(errors.drugTestExpirationMonth)}
                                >
                                    <option value="">-- Select a month --</option>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">Drug Test Expiration Year:</div>
                                <select
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("drugTestExpirationYear")}
                                    aria-invalid={Boolean(errors.drugTestExpirationYear)}
                                >
                                    <option value={-1}>-- Select a year --</option>
                                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
                                    <option value={new Date().getFullYear() + 3}>{new Date().getFullYear() + 3}</option>
                                    <option value={new Date().getFullYear() + 4}>{new Date().getFullYear() + 4}</option>
                                    <option value={new Date().getFullYear() + 5}>{new Date().getFullYear() + 5}</option>
                                    <option value={new Date().getFullYear() + 6}>{new Date().getFullYear() + 6}</option>
                                </select>
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                            <div className="text-2xl font-light">License Number:</div>
                            <input
                                type="text"
                                placeholder="License Number"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("licenseNumber")}
                            />
                        </label>
                        }
                        {
                            isDriver &&
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
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">License Expiration Month:</div>
                                <select
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("licenseExpirationMonth")}
                                    aria-invalid={Boolean(errors.licenseExpirationMonth)}
                                >
                                    <option value="">-- Select a month --</option>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">License Expiration Year:</div>
                                <select
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("licenseExpirationYear")}
                                    aria-invalid={Boolean(errors.licenseExpirationYear)}
                                >
                                    <option value={-1}>-- Select a year --</option>
                                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
                                    <option value={new Date().getFullYear() + 3}>{new Date().getFullYear() + 3}</option>
                                    <option value={new Date().getFullYear() + 4}>{new Date().getFullYear() + 4}</option>
                                    <option value={new Date().getFullYear() + 5}>{new Date().getFullYear() + 5}</option>
                                    <option value={new Date().getFullYear() + 6}>{new Date().getFullYear() + 6}</option>
                                </select>
                            </label>
                        }
                        {
                            isDriver &&
                            <label>
                                <div className="text-2xl font-light">Notes:</div>
                                <textarea
                                    placeholder="Message"
                                    className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                    {...register("notes")}
                                    aria-invalid={Boolean(errors.notes)}
                                />
                            </label>
                        }
                        <div></div>
                        <div></div>
                        {
                            isDriver && <div></div>
                        }
                        <div className="flex justify-start mt-8">
                            <button className="px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onBack}>Back</button>
                            <input
                                type="submit"
                                disabled={isSubmitting || !isDirty || !isValid}
                                className="rounded border border-slate-200 text-slate-200 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                            />
                        </div>
                        { showError &&
                            <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the request to save the user.  Please try again or contact us at info@busapp.com</div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserCreate;