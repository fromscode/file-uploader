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
    .notEmpty()
    .withMessage("Folder name cannot be empty")
    .matches(/^[a-zA-Z_]+[a-zA-Z0-9 _\-]*$/v)
    .withMessage(
      "Folder name must begin with an alphabet or underscore and must not contain special characters",
    );

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

const validateFileName = (name: string) =>
  body(name)
    .trim()
    .notEmpty()
    .withMessage("File name cannot be empty")
    .matches(/^[a-zA-Z_]+[a-zA-Z0-9 _\-]*$/v)
    .withMessage("File name is invalid");

const validateFIleURL = (name: string) =>
  body(name)
    .trim()
    .notEmpty()
    .withMessage("File url cannot be empty")
    .isURL()
    .withMessage("File url is invalid");

const validateFileId = (name: string, place: "body" | "param" = "body") =>
  place == "param"
    ? param(name)
        .trim()
        .isInt({
          min: 1,
          max: 2 * 31 - 1,
        })
        .withMessage("File id must be a valid numeric id")
        .toInt()
    : body(name)
        .trim()
        .isInt({
          min: 1,
          max: 2 * 31 - 1,
        })
        .withMessage("File id must be a valid numeric id")
        .toInt();

export default {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,

  validateFolderName,
  validateFolderId,

  validateFileName,
  validateFIleURL,
  validateFileId,
};
