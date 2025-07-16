import z from "zod";

export const PersonalLiveInValidationSchema = z.object({
    address: z.string()
        .min(1, "Address is required"),
    
    postal_code: z.number()
        .min(1, "Postal code is required")
        .int("Postal code should be a number")
        
})