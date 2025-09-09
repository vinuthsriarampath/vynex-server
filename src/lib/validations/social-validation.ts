import { Platform } from "@prisma/client";
import { z } from "zod";

type PlatformType = (typeof Platform)[keyof typeof Platform];

export const SocialValidationSchema = z.object({
    platform: z.enum(Object.values(Platform) as [PlatformType, ...PlatformType[]]).refine(
        (val) => Object.values(Platform).includes(val),
        { message: "Platform must be one of the allowed values" }
    ),
    url: z.string().url({ message: "URL must be a valid URL" }),
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(30, { message: "Username cannot exceed 30 characters" }),
    // priority: z.number()
    //     .int({ message: "Priority must be an integer" })
    //     .positive({ message: "Priority must be a positive number" })
    //     .min(1, { message: "Priority must be at least 1" }),
});
