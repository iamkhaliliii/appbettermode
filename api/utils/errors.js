/**
 * Error handling utilities
 */
/**
 * Formats ZodError into a standard error response format
 * Works with both client-side and server-side validation
 */
export function formatZodError(error) {
    const flattened = error.flatten();
    const fieldErrors = {};
    // Convert all field errors to ensure they're string arrays (not undefined)
    Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
        fieldErrors[key] = value || [];
    });
    return { fieldErrors };
}
