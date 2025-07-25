import { z } from "zod";

// Comprehensive validation schema using industry standards
export const ProjectValidationSchema = z.object({
    project_name: z.string()
        .min(1, "Project name is required")
        .max(100, "Project name must be less than 100 characters")
        .regex(/^[a-zA-Z0-9\s\-_\.]+$/, "Project name can only contain letters, numbers, spaces, hyphens, underscores, and dots")
        .optional(),

    show_case: z.boolean(),

    thumbnail: z.string()
        .optional(),
    
    repo_id: z.number()
        .int("Repository ID must be an integer")
        .positive("Repository ID must be positive")
        .min(1, "Repository ID must be at least 1"),
    
    repo_name: z.string()
        .min(1, "Repository name is required")
        .max(100, "Repository name must be less than 100 characters")
        .regex(/^[a-zA-Z0-9\-_\.\/]+$/, "Repository name can only contain letters, numbers, hyphens, underscores, dots, and forward slashes"),
    
    html_url: z.string()
        .url("HTML URL must be a valid URL")
        .startsWith("https://", "HTML URL must use HTTPS protocol")
        .max(500, "HTML URL must be less than 500 characters"),
    
    clone_url: z.string()
        .url("Clone URL must be a valid URL")
        .startsWith("https://", "Clone URL must use HTTPS protocol")
        .max(500, "Clone URL must be less than 500 characters"),
    
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    
    language: z.string()
        .max(50, "Language must be less than 50 characters")
        .regex(/^[a-zA-Z0-9\s\-\+]+$/, "Language can only contain letters, numbers, spaces, hyphens, and plus signs")
        .optional()
        .nullish(),
    
    status: z.enum(["in-progress", "completed"]),
    
    createdAt: z.coerce.date()
        .refine((date) => !isNaN(date.getTime()), "Created date must be a valid date"),
    
    updatedAt: z.coerce.date()
        .refine((date) => !isNaN(date.getTime()), "Updated date must be a valid date")
});

// Type inference from the schema
export type ProjectValidationType = z.infer<typeof ProjectValidationSchema>;

// Additional business logic validation functions
export const validateProjectBusinessRules = (data: ProjectValidationType) => {
    const errors: string[] = [];
    
    // Check if updated date is not earlier than created date
    if (data.updatedAt < data.createdAt) {
        errors.push("Updated date cannot be earlier than created date");
    }
    
    // Check if URLs are from the same repository
    try {
        const htmlUrlRepo = new URL(data.html_url).pathname.split('/').slice(1, 3).join('/');
        const cloneUrlRepo = data.clone_url.split('/').slice(-2).join('/').replace('.git', '');
        
        if (htmlUrlRepo !== cloneUrlRepo) {
            errors.push("HTML URL and clone URL must reference the same repository");
        }
    } catch (error) {
        errors.push("Invalid URL format");
    }
    
    return errors;
}; 