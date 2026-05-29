import { readFileSync } from "fs";
import { join } from "path";
/**
 * Função utilitária para ler o conteúdo de um ficheiro .graphql
 * de forma síncrona e decodificá-lo como string UTF-8.
 */
const loadGraphQL = (relativePath: string): string => {
  return readFileSync(join(__dirname, relativePath), "utf-8");
};

// 1. Carrega o Schema Base (Contém a declaração inicial de Query, Mutation e o schema {})
const baseSchema = loadGraphQL("./index.graphql");

const authTypes = loadGraphQL("./auth/auth.types.graphql");
const authInputs = loadGraphQL("./auth/auth.inputs.graphql");
const authQueries = loadGraphQL("./auth/auth.queries.graphql");
const authMutations = loadGraphQL("./auth/auth.mutations.graphql");

// 2. Domínio: Services (Tratamentos de Detalhe Automóvel)
const serviceTypes = loadGraphQL("./service/service.types.graphql");
const serviceQueries = loadGraphQL("./service/service.queries.graphql");
const serviceInputs = loadGraphQL("./service/service.inputs.graphql");
const serviceMutations = loadGraphQL("./service/service.mutations.graphql");

// 3. Domínio: Bookings (Agenda / Marcações)
const bookingTypes = loadGraphQL("./booking/booking.types.graphql");
const bookingInputs = loadGraphQL("./booking/booking.inputs.graphql");
const bookingQueries = loadGraphQL("./booking/booking.queries.graphql");
const bookingMutations = loadGraphQL("./booking/booking.mutations.graphql");

const vehicleTypes = loadGraphQL("./vehicle/vehicle.types.graphql");
const vehicleInputs = loadGraphQL("./vehicle/vehicle.inputs.graphql");
const vehicleQueries = loadGraphQL("./vehicle/vehicle.queries.graphql");
const vehicleMutations = loadGraphQL("./vehicle/vehicle.mutations.graphql");

const profileTypes = loadGraphQL("./profile/profile.types.graphql");
const profileInputs = loadGraphQL("./profile/profile.inputs.graphql");
const profileQueries = loadGraphQL("./profile/profile.queries.graphql");
const profileMutations = loadGraphQL("./profile/profile.mutations.graphql");

const errorTypes = loadGraphQL("./error/error.types.graphql");

const portfolioTypes = loadGraphQL("./portfolio/portfolio.types.graphql");
const portfolioQueries = loadGraphQL("./portfolio/portfolio.queries.graphql");
const portfolioMutations = loadGraphQL("./portfolio/portfolio.mutations.graphql");
const portfolioInputs = loadGraphQL("./portfolio/portfolio.inputs.graphql");

const reviewsTypes = loadGraphQL("./reviews/reviews.types.graphql");
const reviewsQueries = loadGraphQL("./reviews/reviews.queries.graphql");
const reviewsMutations = loadGraphQL("./reviews/reviews.mutations.graphql");
const reviewsInputs = loadGraphQL("./reviews/reviews.inputs.graphql");

const faqsTypes = loadGraphQL("./faqs/faqs.types.graphql");
const faqsQueries = loadGraphQL("./faqs/faqs.queries.graphql");
const faqsMutations = loadGraphQL("./faqs/faqs.mutations.graphql");
const faqsInputs = loadGraphQL("./faqs/faqs.inputs.graphql");

const materialsTypes = loadGraphQL("./materials/materials.types.graphql");
const materialsQueries = loadGraphQL("./materials/materials.queries.graphql");
const materialsMutations = loadGraphQL("./materials/materials.mutations.graphql");
const materialsInputs = loadGraphQL("./materials/materials.inputs.graphql");

const dashboardTypes = loadGraphQL("./dashboard/dashboard.types.graphql");
const dashboardQueries = loadGraphQL("./dashboard/dashboard.queries.graphql");

const crmTypes = loadGraphQL("./crm/crm.types.graphql");
const crmQueries = loadGraphQL("./crm/crm.queries.graphql");
const crmMutations = loadGraphQL("./crm/crm.mutations.graphql");
const crmInputs = loadGraphQL("./crm/crm.inputs.graphql");

const appointmentTypes = loadGraphQL("./appointment/appointment.types.graphql");
const appointmentQueries = loadGraphQL("./appointment/appointment.queries.graphql");
const appointmentMutations = loadGraphQL("./appointment/appointment.mutations.graphql");
const appointmentInputs = loadGraphQL("./appointment/appointment.inputs.graphql");

const inventoryTypes = loadGraphQL("./inventory/inventory.types.graphql");
const inventoryQueries = loadGraphQL("./inventory/inventory.queries.graphql");
const inventoryMutations = loadGraphQL("./inventory/inventory.mutations.graphql");
const inventoryInputs = loadGraphQL("./inventory/inventory.inputs.graphql");

const staffTypes = loadGraphQL("./staff/staff.types.graphql");
const staffQueries = loadGraphQL("./staff/staff.queries.graphql");
const staffMutations = loadGraphQL("./staff/staff.mutations.graphql");
const staffInputs = loadGraphQL("./staff/staff.inputs.graphql");

const financialTypes = loadGraphQL("./financial/financial.types.graphql");
const financialQueries = loadGraphQL("./financial/financial.queries.graphql");
const financialMutations = loadGraphQL("./financial/financial.mutations.graphql");
const financialInputs = loadGraphQL("./financial/financial.inputs.graphql");

const paymentTypes = loadGraphQL("./payment/payment.types.graphql");
const paymentQueries = loadGraphQL("./payment/payment.queries.graphql");
const paymentMutations = loadGraphQL("./payment/payment.mutations.graphql");
const paymentInputs = loadGraphQL("./payment/payment.inputs.graphql");

const auditTypes = loadGraphQL("./audit/audit.types.graphql");
const auditQueries = loadGraphQL("./audit/audit.queries.graphql");

const holidayTypes = loadGraphQL("./holiday/holiday.types.graphql");
const holidayQueries = loadGraphQL("./holiday/holiday.queries.graphql");
const holidayMutations = loadGraphQL("./holiday/holiday.mutations.graphql");
const holidayInputs = loadGraphQL("./holiday/holiday.inputs.graphql");


/**
 * Interpolação e combinação de todos os módulos de schemas.
 * O Apollo Server irá compilar esta string final e validar todas as relações.
 */
const typeDefs = `
  ${baseSchema}

  ${errorTypes}

  ${authTypes}
  ${authInputs}
  ${authQueries}
  ${authMutations}
  
  ${serviceTypes}
  ${serviceQueries}
  ${serviceInputs}
  ${serviceMutations}

  ${bookingTypes}
  ${bookingInputs}
  ${bookingQueries}
  ${bookingMutations}

  ${vehicleTypes}
  ${vehicleInputs}
  ${vehicleQueries}
  ${vehicleMutations}

  ${profileTypes}
  ${profileInputs}
  ${profileQueries}
  ${profileMutations}

  ${portfolioTypes}
  ${portfolioQueries}
  ${portfolioMutations}
  ${portfolioInputs}

  ${reviewsTypes}
  ${reviewsQueries}
  ${reviewsMutations}
  ${reviewsInputs}

  ${faqsTypes}
  ${faqsQueries}
  ${faqsMutations}
  ${faqsInputs}

  ${materialsTypes}
  ${materialsQueries}
  ${materialsMutations}
  ${materialsInputs}

  ${dashboardTypes}
  ${dashboardQueries}

  ${crmTypes}
  ${crmQueries}
  ${crmMutations}
  ${crmInputs}

  ${appointmentTypes}
  ${appointmentQueries}
  ${appointmentMutations}
  ${appointmentInputs}

  ${inventoryTypes}
  ${inventoryQueries}
  ${inventoryMutations}
  ${inventoryInputs}

  ${staffTypes}
  ${staffQueries}
  ${staffMutations}
  ${staffInputs}

  ${financialTypes}
  ${financialQueries}
  ${financialMutations}
  ${financialInputs}

  ${paymentTypes}
  ${paymentQueries}
  ${paymentMutations}
  ${paymentInputs}

  ${auditTypes}
  ${auditQueries}

  ${holidayTypes}
  ${holidayQueries}
  ${holidayMutations}
  ${holidayInputs}

`;

export default typeDefs;