import { t } from "elysia";
import validationErrorHandlers from "../utils/validationErrorHandlers";

export const signInValidations = t.Object(
  {
    username: t.String({
      maxLength: 30,
      minLength: 3,
      description: "User is required and should be between 3 to 30 characters",
      error: validationErrorHandlers,
    }),
    password: t.String({
      maxLength: 20,
      minLength: 8,
      pattern: "/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/",
      default: "",
      description:
        "User password is required and should be between 8 to 20 characters and contain at least one letter and one number",
      error: validationErrorHandlers,
    }),
  },
  {
    description: "Expected a username and password",
  }
);

/**
 * @description Validations for sign-up
 */
export const signUpValidations = t.Object(
  {
    email: t.String({
      format: "email",
      description: "User email is required and should be a valid email address",
      error: validationErrorHandlers,
    }),
    phone: t.String({
      pattern: "/^\\+?[1-9]\\d{1,14}$/",
      description:
        "User phone number is required and should be a valid phone number",
      error: validationErrorHandlers,
    }),
    password: t.String({
      maxLength: 20,
      minLength: 8,
      pattern: "/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/",
      default: "",
      description:
        "User password is required and should be between 8 to 20 characters and contain at least one letter and one number",
      error: validationErrorHandlers,
    }),
  },
  {
    description: "Expected email, phone and password for sign-up",
  }
);
