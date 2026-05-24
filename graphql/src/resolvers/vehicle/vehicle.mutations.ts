import { API } from '../../proxy/serviceproxy/api';

export const vehicleMutations = {
    addVehicle: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Vehicles/Add", input);
            
            return {
                vehicle: data.Vehicle || null,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                vehicle: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    setPrimaryVehicle: async (_: any, { vehicleId }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Vehicles/SetPrimary", {
                vehicle_id: parseInt(vehicleId)
            });
            
            return {
                vehicle: data.Vehicle || null,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                vehicle: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    updateVehicle: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PATCH<any>(context, `/Vehicles/${input.vehicleId}`, input);
            
            return {
                vehicle: data.Vehicle || null,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                vehicle: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    deleteVehicle: async (_: any, { vehicleId }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Vehicles/${vehicleId}`);
            
            return {
                success: data.success || false,
                error: data.error || null
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};