import { createTRPCRouter } from "~/server/api/trpc";

import { eldRouter } from "~/server/api/routers/eld";
import { vehicleTypeRouter } from "./routers/vehicleType";
import { userTypeRouter } from "./routers/userType";
import { dayRouter } from "./routers/day";
import { bookingStatusRouter } from "./routers/bookingStatus";
import { companyRouter } from "./routers/company";
import { vehicleRouter } from "./routers/vehicle";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  eld: eldRouter,
  vehicleType: vehicleTypeRouter,
  userType: userTypeRouter,
  day: dayRouter,
  bookingStatus: bookingStatusRouter,
  company: companyRouter,
  vehicle: vehicleRouter,
  
});

// export type definition of API
export type AppRouter = typeof appRouter;
