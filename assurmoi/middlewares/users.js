const { checkSchema, validationResult } = require("express-validator");

async function validateUserCreation(req, res, next) {
  await checkSchema({
    email: { notEmpty: true, isEmail: true },
    password_hash: { notEmpty: true },
    role: { notEmpty: true }
  }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Missing required user fields",
      errors: errors.array()
    });
  }
  next();
}

module.exports = {
  validateUserCreation,
};
