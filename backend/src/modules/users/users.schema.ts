const z = require('zod');

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  bio: z.string().optional()
});

function validateUser(data) {
  return userSchema.safeParse(data);
}

module.exports = { validateUser };