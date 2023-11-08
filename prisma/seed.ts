import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// import userType from './data/userType';
// import vehicleType from "./data/vehicleType";
// import eld from "./data/eld";
// import bookingStatus from "./data/bookingStatus";
// import paymentStatus from "./data/paymentStatus";
// import day from "./data/day";
// import state from "./data/state";

async function main() {
    // lvl 1 seeding - no dependencies

    // // user types
    // await prisma.userType.createMany({ data: userType });

    // // vehicle types
    // await prisma.vehicleType.createMany({ data: vehicleType });

    // // ELDs
    // await prisma.eLD.createMany({ data: eld });

    // // booking status
    // await prisma.bookingStatus.createMany({ data: bookingStatus });

    // // payment status
    // await prisma.paymentStatus.createMany({ data: paymentStatus });

    // // day
    // await prisma.day.createMany({ data: day });

    // // state
    // await prisma.state.createMany({ data: state });
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