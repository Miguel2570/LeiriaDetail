import { authMutations } from './auth/auth.mutation';
import { authQueries } from './auth/auth.queries';

import { servicesQueries } from './service/service.queries';
import { serviceMutations } from "./service/service.mutations";

import { bookingsQueries } from './booking/booking.queries';
import { bookingsMutations } from './booking/booking.mutations';

import { vehicleQueries } from './vehicle/vehicle.queries';
import { vehicleMutations } from './vehicle/vehicle.mutations';

import { profileQueries } from './profile/profile.queries';
import { profileMutations } from './profile/profile.mutations';

import { portfolioQueries } from './portfolio/portfolio.queries';
import { portfolioMutations } from './portfolio/portfolio.mutations';

import { reviewsQueries } from './reviews/reviews.queries';
import { reviewsMutations } from './reviews/reviews.mutations';

import { faqsQueries } from './faqs/faqs.queries';
import { faqsMutations } from './faqs/faqs.mutations';

import { materialsQueries } from './materials/materials.queries';
import { materialsMutations } from './materials/materials.mutations';

const resolvers = {
    Query: {
        ...servicesQueries,
        ...bookingsQueries,
        ...vehicleQueries,
        ...authQueries,
        ...profileQueries,
        ...portfolioQueries,
        ...reviewsQueries,
        ...faqsQueries,
        ...materialsQueries
    },
    Mutation: {
        ...authMutations,
        ...serviceMutations,
        ...bookingsMutations,
        ...vehicleMutations,
        ...profileMutations,
        ...portfolioMutations,
        ...reviewsMutations,
        ...faqsMutations,
        ...materialsMutations
    }
};

export default resolvers;