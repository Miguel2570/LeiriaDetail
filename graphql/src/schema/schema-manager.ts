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
/**
 * Interpolação e combinação de todos os módulos de schemas.
 * O Apollo Server irá compilar esta string final e validar todas as relações.
 */
const typeDefs = `
  ${baseSchema}

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
`;

export default typeDefs;