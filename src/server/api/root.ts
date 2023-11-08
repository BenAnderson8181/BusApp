import { createTRPCRouter } from "~/server/api/trpc";

import { eldRouter } from "~/server/api/routers/eld";
import { vehicleTypeRouter } from "./routers/vehicleType";
import { userTypeRouter } from "./routers/userType";
import { dayRouter } from "./routers/day";
import { bookingStatusRouter } from "./routers/bookingStatus";
import { companyRouter } from "./routers/company";
import { vehicleRouter } from "./routers/vehicle";
import { vehicleImageRouter } from "./routers/vehicleImage";
import { garageRouter } from "./routers/garage";
import { userRouter } from "./routers/user";
import { userVehicleTypeRouter } from "./routers/userVehicleType";
import { rateRouter } from "./routers/rate";
import { adjustmentRouter } from "./routers/adjustment";
import { rateTypeRouter } from "./routers/rateType";
import { adjustmentDayRouter } from "./routers/adjustmentDay";
import { adjustmentRateTypeRouter } from "./routers/adjustmentRateType";
import { bookingRouter } from "./routers/booking";
import { bookingDetailRouter } from "./routers/bookingDetail";
import { bookingDriverRouter } from "./routers/bookingDriver";
import { bidRouter } from "./routers/bid";
import { paymentRouter } from "./routers/payment";
import { stateRouter } from "./routers/state";

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
  vehicleImage: vehicleImageRouter,
  garage: garageRouter,
  user: userRouter,
  userVehicleType: userVehicleTypeRouter,
  rate: rateRouter,
  adjustment: adjustmentRouter,
  rateType: rateTypeRouter,
  adjustmentDay: adjustmentDayRouter,
  adjustmentRate: adjustmentRateTypeRouter,
  booking: bookingRouter,
  bookingDetail: bookingDetailRouter,
  bookingDriver: bookingDriverRouter,
  bid: bidRouter,
  payment: paymentRouter,
  state: stateRouter,
  
});

// export type definition of API
export type AppRouter = typeof appRouter;
