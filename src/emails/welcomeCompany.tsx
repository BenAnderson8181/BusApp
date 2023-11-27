import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Text,
    Tailwind,
    Link
  } from '@react-email/components';
  import * as React from 'react';
  
  type WelcomeProps = {
    companyId: string;
    firstName: string;
    lastName: string;
    companyName: string;
  }
  
  export const WelcomeEmail = ({ companyId, firstName, lastName, companyName}: WelcomeProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-black p-16 rounded-lg w-3/4 text-slate-100">
                    <Heading >Welcome {firstName} {lastName}!</Heading>
                    <Text className='text-lg'>
                        Thank you for signing up with Go Florida Charter!<br />
                        We look forward to serving you and your company, {companyName}&apos;s needs.
                    </Text>
                    <Text className="text-lg">
                        Kind regards,<br /> Go Florida Charter
                    </Text>
                    <br />
                    <Text className='text-lg italic'>
                        To get started click the link below to go to your company dashboard!
                    </Text>
                    <Link 
                        className="py-4 px-6 rounded-full bg-black font-semibold cursor-pointer border-2 border-slate-100"
                        href={`http://localhost:3000/company/${companyId}`}>
                        Go Florida Charter
                    </Link>
                </Container>
            </Body>
        </Tailwind>
    </Html>
  );
  
  export default WelcomeEmail;
  