import { Resend } from 'resend';
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from 'next';
import WelcomeEmail from "~/emails/welcomeCompany";

const resend = new Resend(env.RESEND_API_KEY);

type WelcomeEmailProps = {
    firstName: string;
    lastName: string;
    companyId: string;
    companyName: string;
    email: string;
}

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    const params = { email: 'banderson@affiliatedcourtservices.org' }

    try {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
        const { firstName, lastName, companyId, companyName, email }: WelcomeEmailProps = JSON.parse(request.body);

        if (firstName && lastName && companyId && email) {
            const { data, error } = await resend.emails.send({
                from: 'Welcome <onboarding@resend.dev>',
                to: params?.email, // Once we set up the domain this should be toEmail
                subject: 'Welcome to Go Florida Charter',
                react: WelcomeEmail({ firstName, lastName, companyId, companyName })
            });
    
            if (error) {
                console.error('Error: ', error)
                return response.status(400).json({ error });
            }
    
            return response.status(200).json(data);
        }

        return response.status(400).json({ error: 'Invalid params.' });
    }
    catch (error) {
        console.error(error);
        
        return response.status(500).json(error);
    } 
}