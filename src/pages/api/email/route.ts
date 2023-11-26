import { Resend } from 'resend';
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from 'next';
import CompanyWelcomeEmail from "~/emails/welcomeCompany";

const resend = new Resend(env.RESEND_API_KEY);

// change this back to POST when done testing
export default async function GET(request: NextApiRequest, response: NextApiResponse) {
    const email = 'banderson@affiliatedcourtservices.com';
    const params = { type: 'Welcome Company', firstName: 'Ben', lastName: 'Anderson' , companyId: '' }

    if (request) {
        console.log('HELLO FROM ROUTE')
        console.log('body: ', request.body)
        console.log('query: ', request.query)
    }

    let data;
    try {
        if (!email)
            throw new Error('Email address is invalid');

        switch (params.type) {
            case 'Welcome Company':
                const { data, error } = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: email,
                    subject: 'Welcome to ACS',
                    react: CompanyWelcomeEmail({
                        firstName: params?.firstName,
                        lastName: params?.lastName,
                        companyId: params?.companyId
                    })
                });

                console.log('DATA: ', data);

                if (error) {
                    return response.status(400).json({ error });
                }

                break;

            // default:
            //     data = await resend.sendEmail({
            //         from: 'onboarding@resend.dev',
            //         to: 'ben@priorsolutionsllc.com',
            //         subject: 'Test',
            //         react: WelcomeEmail({
            //             firstName: 'John',
            //             lastName: 'Doe',
            //             accountId: ''
            //         })
            //     });

            //     break;
        }

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(400).json(error);
    }
}