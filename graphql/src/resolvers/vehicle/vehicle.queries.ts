import { API } from '../../proxy/serviceproxy/api';

export const vehicleQueries = {
    userVehicles: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Vehicles/List");
            
            return {
                vehicles: data.Vehicles || [],
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