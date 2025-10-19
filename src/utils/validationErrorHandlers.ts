import type { ElysiaTypeCustomErrorCallback } from "elysia";

/**
 * @author Lusaib Latheef
 * @description Handles validation errors and reformats them.
 */
const validationErrorHandlers: ElysiaTypeCustomErrorCallback = (err) => {
  const errors = err.errors || [];
  const reformattedErrors = errors.map((e) => ({
    message: e.message,
    field: e.path,
  }));
  return {
    status: 401,
    message: err.message,
    success: false,
    errors: reformattedErrors,
  };
};

export default validationErrorHandlers;
