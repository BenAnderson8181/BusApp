import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Text,
    Tailwind
  } from '@react-email/components';
  import * as React from 'react';
  
  type WelcomeProps = {
    firstName?: string;
    lastName?: string;
  }
  
  export const WelcomeEmail = ({ firstName, lastName }: WelcomeProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-black p-16 rounded-lg w-3/4 text-slate-100">
                    <Heading >Welcome {firstName} {lastName}!</Heading>
                    <Text className='text-lg'>
                        Thank you for signing up with Go Florida Charter!<br />
                        We look forward to serving you.
                    </Text>
                    <Text className="text-lg">
                        Kind regards,<br /> Go Florida Charter
                    </Text>
                    <br />
                    <Text className='text-lg italic'>
                        To get started click the link below to get a quote!
                    </Text>
                    <Link 
                        className="py-4 px-6 rounded-full bg-black font-semibold cursor-pointer border-2 border-slate-100"
                        href={`http://localhost:3000/get-quote`}>
                        Go Florida Charter
                    </Link>
                </Container>
            </Body>
        </Tailwind>
    </Html>
  );
  
  export default WelcomeEmail;
  