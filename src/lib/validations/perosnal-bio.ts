import z from "zod";

export const PersonalBioValidationSchema = z.object({
    bio: z.string()
        .min(1, "Bio is required")
        
})