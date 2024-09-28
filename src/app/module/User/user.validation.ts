import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email(),
    profileImage: z.string({ required_error: "Profile Image is required" }),
    password: z.string({ required_error: "Password is required" }),
    phone: z.string({ required_error: "Phone Number is required" }),
    role: z.enum(["admin", "user"]),
    isVerified: z.boolean().optional(),
  }),
});

export const userValidations = {
  userValidationSchema,
};
