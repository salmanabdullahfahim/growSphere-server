import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Email must be a valid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const authValidations = {
  loginValidationSchema,
};
