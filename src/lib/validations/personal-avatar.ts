import z from "zod";

export const PersonalAvatarValidationSchema = z.object({
    avatar: z.string()
        .min(1, "Avatar is required")
        
})