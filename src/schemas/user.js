import Joi from 'joi';

// Purpose: Define the schema for user registration.
export const userRegistrationSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  nickname: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
  .regex(/^(?=.*[a-z])(?=.*[A-Z0-9])[a-zA-Z0-9\s!@#$%^&*()_+=-{};:"<>,./?]{8,}$/, {
    name: 'password',
    invert: false
  })
});

// Purpose: Define the schema for user login.
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Purpose: Define the schema for updating user information.
export const userUpdateSchema = Joi.object({
  fullName: Joi.string().min(3).max(50),
  nickname: Joi.string().min(3).max(20),
  profilePic: Joi.string(),
  email: Joi.string().email()
});

// Purpose: Define the schema for password reset and update.
export const passwordUpdateSchema = Joi.object({
  password: Joi.string().min(6).required(),
  newPassword: Joi.string().min(8).required()
  .regex(/^(?=.*[a-z])(?=.*[A-Z0-9])[a-zA-Z0-9\s!@#$%^&*()_+=-{};:"<>,./?]{8,}$/, {
    name: 'password',
    invert: false
  }),
});