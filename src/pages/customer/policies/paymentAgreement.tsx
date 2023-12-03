import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { ReactNode } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    children?: ReactNode
}

const PaymentAgreementConsent: React.FC<Props> = (props) => {
    console.log(props);
    const { user } = useUser();
    const router = useRouter();
    const [showSignature, setShowSignature] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const userQuery = api.user.findAccountByExternalId.useQuery({externalId: userId});
    const policyQuery = api.policy.list.useQuery();
    const userPolicyQuery = api.userPolicy.list.useQuery({ externalId: userId });
    const userSignatureQuery = api.userSignature.load.useQuery({ externalId: userId });
    const userPolicyMutation = api.userPolicy.upsert.useMutation();

    if (userQuery.isLoading || policyQuery.isLoading || userPolicyQuery.isLoading || userSignatureQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (userQuery.isError || policyQuery.isError || userPolicyQuery.isError || userSignatureQuery.isError) {
        return <LoadError type='Page' />
    }

    const _user = userQuery.data;
    const userSignature = userSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Payment Agreement');
    const userPolicies = userPolicyQuery.data;
    const paymentAgreementPolicy = userPolicies.find((p) => p.policyId === policy?.id);

    if (paymentAgreementPolicy?.signed === true)
        router.push('/get-quote').catch((err) => console.error(err));

    const handleSign = () => {
        setShowSignature(true);
    }

    const handleNext = async () => {
        // check if the signature is showing
        if(!showSignature) {
            setShowErrorAlert(true);
            return;
        }

        // save the signature
        if (!_user?.id) return;
        if (!policy?.id) return;

        const result = await userPolicyMutation.mutateAsync({
            userId: _user?.id,
            policyId: policy?.id,
            signed: true,
        })
        .catch((err) => {
            setShowSaveErrorAlert(true);
            console.error('error: ', err);
        });

        if (!result) {
            return;
        }
        
        router.push('/get-quote').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000] text-slate-100 pb-8">
            <h1 className="text-4xl font-thin my-10">PAYMENT AGREEMENT</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-slate-900 mb-12 bg-slate-200 text-slate-700">
                <p>I, {_user?.firstName}&nbsp;{_user?.lastName}, agree to pay the amount for the respective service listed below:</p>
                <ul className="list-disc pl-8">
                    <li><span className="font-semibold">Group Session:</span> $50.00 per session</li>
                </ul>
                <br />
                <p>Payments will be made prior to each session, interview, or program. I also agree to pay a fee of $50 for no-shows or cancellations (less than 48 hours ahead of scheduled appointment time) of individual or re-evaluation sessions missed or $20 for each Group Session missed. Any emergencies requiring you to re-schedule, please contact our Office as soon as possible.</p>
                <div>
                    <div className="inline-flex">
                        <input className="peer" type="radio" name="allowedPayment" id="automatic" value="1" defaultChecked={true} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 pl-6" htmlFor="automatic">
                            I authorize Go Florida Charter to bill the credit card on file on the dates I attend sessions for the above-mentioned amounts
                        </label>
                    </div>
                </div>
                <br />
                <p>Failure to make payment according to this Payment Agreement will prevent you from attending future sessions as well as cancel any already scheduled sessions. Any re-issuance of a certificate of completion will require a $10 fee.</p>
                <br />
                <p>If my treatment account should become delinquent and turned over to a collection agency, I agree to pay all attorney and collection fees, as well as any court costs associated with efforts to collect on my delinquent account.</p>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
                {
                    !showSignature &&
                    <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-slate-900 hover:opacity-70" onClick={handleSign}>Click to sign</button>
                }
                {
                    showSignature &&
                    <div className="mb-6 inline rounded-md bg-slate-100">
                        {userSignature?.signature && 
                            <div className="inline">Signed:&nbsp;&nbsp;&nbsp;<img alt="Signature" src={userSignature?.signature} className="inline" /></div>
                        }
                    </div>
                }
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-slate-900 hover:opacity-70 text-2xl mb-5" onClick={handleNext}>Next</button>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added before moving forward.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
        </div>
    );
}

export default PaymentAgreementConsent;