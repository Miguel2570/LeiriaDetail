import { authMutations } from './auth/auth.mutation';
import { authQueries } from './auth/auth.queries';

import { serviceQueries } from './service/service.queries';
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

import { dashboardQueries } from './dashboard/dashboard.queries';

import { crmQueries } from './crm/crm.queries';
import { crmMutations } from './crm/crm.mutations';

import { appointmentQueries } from './appointment/appointment.queries';
import { appointmentMutations } from './appointment/appointment.mutations';

import { financialQueries } from './financial/financial.queries';
import { financialMutations } from './financial/financial.mutations';

import { staffQueries } from './staff/staff.queries';
import { staffMutations } from './staff/staff.mutations';

import { inventoryQueries } from './inventory/inventory.queries';
import { inventoryMutations } from './inventory/inventory.mutations';

import { paymentQueries } from './payment/payment.queries';
import { paymentMutations } from './payment/payment.mutations';

import { auditQueries } from './audit/audit.queries';

import { holidayMutations } from './holiday/holiday.mutations';
import { holidayQueries } from './holiday/holiday.queries';

import { registosMutations } from './registo/registos.mutations';
import { registosQueries } from './registo/registos.queries';

const resolvers = {
    Query: {
        ...serviceQueries,
        ...bookingsQueries,
        ...vehicleQueries,
        ...authQueries,
        ...profileQueries,
        ...portfolioQueries,
        ...reviewsQueries,
        ...faqsQueries,
        ...materialsQueries,
        ...dashboardQueries,
        ...crmQueries,
        ...appointmentQueries,
        ...financialQueries,
        ...staffQueries,
        ...inventoryQueries,
        ...paymentQueries,
        ...auditQueries,
        ...holidayQueries,
        ...registosQueries
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
        ...materialsMutations,
        ...crmMutations,
        ...appointmentMutations,
        ...financialMutations,
        ...staffMutations,
        ...inventoryMutations,
        ...paymentMutations,
        ...holidayMutations,
        ...registosMutations
    }
};

export default resolvers;