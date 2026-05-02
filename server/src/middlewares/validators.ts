import { body } from "express-validator";

const validateUsername = body("username")
  .trim()
  .escape()
  .isLength({
    min: 3,
  })
  .withMessage("Username needs to be atleast 3 characters long");

const validateEmail = body("email")
  .trim()
  .escape()
  .isEmail()
  .withMessage("Email must be valid");

const validatePassword = body("password")
  .trim()
  .isLength({
    min: 6,
  })
  .withMessage("Password must be at least 6 characters long");

const validateConfirmPassword = body("confirm-password")
  .custom((value, { req }) => value === req.body.password)
  .withMessage("Password and Confirm Password fields must match");

export default {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
