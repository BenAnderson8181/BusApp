import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// import userType from './data/userType';
// import vehicleType from "./data/vehicleType";
// import eld from "./data/eld";
// import bookingStatus from "./data/bookingStatus";
// import paymentStatus from "./data/paymentStatus";
// import day from "./data/day";
// import state from "./data/state";
// import policy from "./data/policy";
import requiredPolicy from "./data/requiredPolicy";
// import documentType from "./data/documentType";

async function main() {
//     // lvl 1 seeding - no dependencies

//     // user types
//     await prisma.userType.createMany({ data: userType });

//     // vehicle types
//     await prisma.vehicleType.createMany({ data: vehicleType });

//     // ELDs
//     await prisma.eLD.createMany({ data: eld });

//     // booking status
//     await prisma.bookingStatus.createMany({ data: bookingStatus });

//     // payment status
//     await prisma.paymentStatus.createMany({ data: paymentStatus });

//     // day
//     await prisma.day.createMany({ data: day });

//     // state
//     await prisma.state.createMany({ data: state });

        // // policy
        // await prisma.policy.createMany({ data: policy });

        // // document type
        // await prisma.documentType.createMany({ data: documentType });

        // level 2 seeding - dependant on a level 1 id

        // required policy - depends on User Type and Policy
        await prisma.requiredPolicy.createMany({ data: requiredPolicy });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
});