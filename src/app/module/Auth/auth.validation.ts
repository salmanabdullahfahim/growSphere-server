import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email address"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be a valid email address"),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "Id is required" }),
    password: z.string({ required_error: "Password is required" }),
    token: z.string({ required_error: "Token is required" }),
  }),
});

export const authValidations = {
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
