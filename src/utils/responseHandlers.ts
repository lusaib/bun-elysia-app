/**
 * Interface defining the standard structure for all API responses.
 * T is a generic type for the data payload, allowing flexibility while maintaining structure.
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  success: boolean;
  data: T | null; // Data is optional, especially for success responses
}

/**
 * Handles the API response by setting the status, message, success, and data properties.
 *
 * @param status The HTTP status code (default: 200).
 * @param message A human-readable message describing the outcome.
 * @param success Boolean indicating if the operation was successful (default: true).
 * @param data The primary payload of the response.
 * @returns A structured ApiResponse object.
 */
export const handleResponse = <T>(
  status: number = 200,
  message: string = "Operation successful",
  success: boolean = true,
  data: T | null = null // Allows data to be explicitly null
): ApiResponse<T> => {
  // If you were using Elysia's context, you would set the status here:
  // ctx.set.status = status;

  // Note: Caching headers are usually set via Elysia's 'set' object or a global middleware.
  // const setHeader = { "Cache-Control": "no-store" };

  return { status, message, success, data };
};

export default handleResponse;
