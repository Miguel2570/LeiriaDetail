import { API } from '../../proxy/serviceproxy/api';

export const vehicleQueries = {
    userVehicles: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Vehicles/List");
            
            return {
                vehicles: (data.Vehicles || []).map((v: any) => ({
                    id: v.id?.toString(),
                    licensePlate: v.license_plate || '',
                    brand: v.brand || '',
                    model: v.model || '',
                    year: v.year || null,
                    fuelType: v.fuel_type || null,
                    sizeCategory: v.size_category || 'C',
                    isPrimary: v.is_primary || false
                })),
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                vehicles: [],
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};