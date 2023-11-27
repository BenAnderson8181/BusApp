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
        isDriver: z.boolean().default(false),
        phone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
        drugTestNumber: z.string().optional(),
        drugTestExpirationMonth: z.string().optional(),
        drugTestExpirationYear: z.number().int().optional(),
        licenseNumber: z.string().optional(),
        stateId: z.string().optional(),
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
        router.push(`/login`).catch((err) => console.error(err));
    }

    const createUserMutation = api.user.create.useMutation();
    const userTypeQuery = api.userType.list.useQuery();
    const userAccountQuery = api.user.findAccountByExternalId.useQuery({ externalId: userId });

    if (userTypeQuery.isLoading || userAccountQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (userTypeQuery.isError || userAccountQuery.isError) {
        console.error('failed to load user types');
        return <LoadError type='Page' />
    }

    const userTypeId = userTypeQuery.data.find(t => t.name === 'Customer')?.id ?? '';
    const userAccount = userAccountQuery.data;

    // Check if a user account exists, if so take them to the get-quote page
    if (userAccount) {
        if (userAccount.id?.length > 0) {
            router.push(`/get-quote`).catch((err) => console.error(err));
        }
    }

    if (userTypeId?.length === 0) {
        console.error('failed to find id user type "User"');
        return <LoadError type='Page' />
    }

    const onSubmit = async (_user: UserFormType) => {
        const result = await createUserMutation.mutateAsync({
            ..._user,
            userTypeId,
            externalId: userId,
        })
        .catch((err) => {
            setShowError(true);
            console.error(err);
            return;
        });

        // TODO: add required policies here        

        if (result?.id) {
            await fetch('/api/email/welcomeCustomer', {
                method: 'POST',
                body: JSON.stringify({
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result?.email
                })
            });

            router.push('/get-quote').catch((err) => console.error(err));
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
                        <div></div>
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