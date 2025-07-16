import z from "zod";

export const PersonalInfoValidationSchema = z.object({
    first_name: z.string()
        .min(1, "First name is required")
        .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "First name can only contain letters and single spaces between words"),

    last_name: z.string()
        .min(1,"Last name is required")
        .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "Last name can only contain letters and single spaces between words"),

    contact: z.string()
        .regex(/^[0-9]{10}$/, "Contact must contain exactly 10 numbers"),
        
})