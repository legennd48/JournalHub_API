import Joi from 'joi';

// Purpose: Define the schema for journal entry creation.
export const journalEntrySchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).required(),
  isPublic: Joi.boolean(),
});

// Purpose: Define the schema for updating a journal entry.
export const journalEntryUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(50),
  content: Joi.string().min(3),
  isPublic: Joi.boolean(),
});

