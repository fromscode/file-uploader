import { body, param } from "express-validator";

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

const validateFolderName = (param: string) =>
  body(param)
    .trim()
    .isAlphanumeric()
    .withMessage("Folder name must be alpha numeric")
    .notEmpty()
    .withMessage("Folder name cannot be empty");

const validateFolderId = (name: string, place: "body" | "param" = "body") =>
  place == "param"
    ? param(name)
        .trim()
        .isInt({
          min: 1,
          max: 2 * 31 - 1,
        })
        .withMessage("Folder id must be a valid numeric id")
        .toInt()
    : body(name)
        .trim()
        .isInt({
          min: 1,
          max: 2 * 31 - 1,
        })
        .withMessage("Folder id must be a valid numeric id")
        .toInt();

export default {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,

  validateFolderName,
  validateFolderId,
};
