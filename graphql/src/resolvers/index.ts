import { authMutations } from './auth/auth.mutation';
import { authQueries } from './auth/auth.queries';

import { serviceQueries } from "./service/service.queries";
import { serviceMutations } from "./service/service.mutations";

import { bookingQueries } from "./booking/booking.queries";
import { bookingMutations } from "./booking/booking.mutations";

import { vehicleQueries } from './vehicle/vehicle.queries';
import { vehicleMutations } from './vehicle/vehicle.mutations';

import { profileQueries } from './profile/profile.queries';
import { profileMutations } from './profile/profile.mutations';

const resolvers = {
    Query: {
        ...serviceQueries,
        ...bookingQueries,
        ...vehicleQueries,
        ...authQueries,
        ...profileQueries
    },
    Mutation: {
        ...authMutations,
        ...serviceMutations,
        ...bookingMutations,
        ...vehicleMutations,
        ...profileMutations
    }
};

export default resolvers;