import { Resend } from 'resend';
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from 'next';
import WelcomeEmail from "~/emails/welcome";

const resend = new Resend(env.RESEND_API_KEY);

type WelcomeEmailProps = {
    firstName: string;
    lastName: string;
    companyId: string;
    email: string;
}

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    const params: WelcomeEmailProps = { firstName: 'Ben', lastName: 'Anderson', companyId: 'testcuid', email: 'banderson@affiliatedcourtservices.com' }

    // let emailProps;
    if (request) {
        console.log('HELLO FROM WELCOME')
        console.log('body: ', request.body)
        console.log('query: ', request.query)
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Team <onboarding@resend.dev>',
            to: params?.email,
            subject: 'Welcome to BusApp',
            react: WelcomeEmail({
                firstName: params?.firstName,
                lastName: params?.lastName,
                companyId: params?.companyId
            })
        });

        console.log('DATA: ', data);

        if (error) {
            return response.status(400).json({ error });
        }

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(500).json(error);
    } 
}