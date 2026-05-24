import { serviceQueries } from "./service/service.queries";
import { serviceMutations } from "./service/service.mutations";

import { bookingQueries } from "./booking/booking.queries";
import { bookingMutations } from "./booking/booking.mutations";

import { vehicleQueries } from './vehicle/vehicle.queries';
import { vehicleMutations } from './vehicle/vehicle.mutations';
const resolvers = {
    Query: {
        ...serviceQueries,
        ...bookingQueries,
        ...vehicleQueries,
    },
    Mutation: {
        ...serviceMutations,
        ...bookingMutations,
        ...vehicleMutations,
    }
};

export default resolvers;