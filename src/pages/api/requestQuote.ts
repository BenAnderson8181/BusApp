import type { NextApiRequest, NextApiResponse } from 'next';

type RequestQuoteProps = {
    firstName: string;
    lastName: string;
    email: string;
}

type QuoteProps = {
    firstName: string;
    lastName: string;
    email: string;
}

export default async function POST(request: NextApiRequest, response: NextApiResponse) {

    //const { firstName, lastName, email }: RequestQuoteProps = JSON.parse(request.body);
    const quote: QuoteProps = {firstName: 'This', lastName: 'is', email: 'a test'};
    return response.status(200).json(quote);
}