import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { ReactNode } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import LoadError from "~/components/LoadError";

type Props = {
    children?: ReactNode
}

const InformedConsent: React.FC<Props> = (props) => {
    console.log(props);
    const { user } = useUser();
    const router = useRouter();
    const [showSignature, setShowSignature] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const userQuery = api.user.findAccountByExternalId.useQuery({ externalId: userId });
    const userSignatureQuery = api.userSignature.load.useQuery({ externalId: userId });
    const policyQuery = api.policy.list.useQuery();
    const userPolicyQuery = api.userPolicy.list.useQuery({ externalId: userId });
    const userPolicyMutation = api.userPolicy.upsert.useMutation();

    if (userQuery.isLoading || userSignatureQuery.isLoading || policyQuery.isLoading || userPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (userQuery.isError || userSignatureQuery.isError || policyQuery.isError || userPolicyQuery.isError) {
        return <LoadError type='Page' />
    }

    const _user = userQuery.data;
    const userSignature = userSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Informed Consent');
    const userPolicies = userPolicyQuery.data;
    const informedConsentPolicy = userPolicies.find((p) => p.policyId === policy?.id);

    if (informedConsentPolicy?.signed === true) {
        router.push(`/company/${_user?.companyId}`).catch((err) => console.error(err));
    }  

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
            setShowErrorAlert(true);
            return;
        }
        
        router.push(`/company/${_user?.companyId}`).catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#000] text-slate-100">
            <h1 className="text-4xl font-thin my-10">INFORMED CONSENT</h1>
            <div className="text-lg w-3/4 text-start border border-slate-700 rounded-sm p-8 mb-12 bg-slate-200 text-slate-700">
                <p>This information is provided to help you make informed decisions and to take an active role in your treatment.  If you do not understand this information, please ask a staff member for clarification before signing.  Your signature indicates the information and conditions presented here are understandable and agreeable to you.</p>
                <br />
                <ul className="list-disc pl-8">
                    <li>Therapy is an interactive process meant to promote insight and personal growth in line with the goals you set with your therapist during your treatment.  You will be expected to be an active participant by identifying goals, learning and practicing new skills, and contributing to group discussions.</li>
                    <li>You have the right to appropriately question any part of your treatment and refuse any intervention that you are uncomfortable with by discussing your concerns with your therapist.</li>
                    <li>Recommendations for treatment are based on standard assessments, police and court documents, and input from the therapist after an individual interview with you.  Treatment plans are subject to change according to your progress in therapy or new information from court or probation agents.</li>
                    <li>You have the right to terminate treatment at any time and will be expected to pay only for those services received.  Your termination will be reported to the appropriate court agents.</li>
                    <li>
                        Your participation in our program is confidential within the limits of the laws of the State of Utah and relevant professional codes.  Information you disclose during treatment will not be revealed to anyone without your written permission, with the following exceptions:
                        <ul className="pl-6">
                            <li>∘&nbsp;If you request your information to be submitted to an insurance company on your behalf, information about your diagnosis and treatment plan may be revealed to your insurance carrier.</li>
                            <li>∘&nbsp;Your therapist is required by law to report any “reasonable suspicion” that a child or vulnerable adult is being abused in any manner.</li>
                            <li>∘&nbsp;If your therapist has reason to believe you are in imminent danger of harming yourself or another person, they are required to take reasonable steps to prevent such harm from taking place.</li>
                            <li>∘&nbsp;If your treatment is ordered by a court, updates of your treatment progress will be sent to the appropriate court agent.</li>
                        </ul>
                    </li>
                    <li>You have the right to review your official records at any time, however, be aware that these records belong to the Treatment Center and may not be removed from the Treatment Center.  If you wish, your Therapist or the Clinical Director will review your records with you, and answer any questions concerning the information contained.</li>
                    <li>If you request, your records may be released to any person or agency you designate by filling out and signing an “Authorization for Release of Protected Health Information” form.</li>
                </ul>
                <br />
                <p>I understand the information contained in this Informed Consent agreement and agree to all conditions stated.</p>
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

export default InformedConsent;