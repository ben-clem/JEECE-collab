import { FieldError } from "src/resolvers/objectTypes";

export const validateRegister = (
  email: string,
  password: string
): FieldError[] => {
  let errors: FieldError[] = [];

  if (!email.includes("@")) {
    errors.push({
      field: "email",
      message: "invalid email",
    });
  }

  const regexLength = /^.{8,}$/;
  const regexUppercase = /^(?=.*?[A-Z]).{8,}$/;
  const regexLowercase = /^(?=.*?[a-z]).{8,}$/;
  const regexDigit = /^(?=.*?[0-9]).{8,}$/;
  const regexSpecialChar = /^(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}$/;
  const regexSpace = /[\s]+/;

  if (
    !regexLength.test(password) ||
    !regexUppercase.test(password) ||
    !regexLowercase.test(password) ||
    !regexDigit.test(password) ||
    !regexSpecialChar.test(password)
  ) {
    errors.push({
      field: "password",
      message:
        "password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a digit number, and a special character",
    });
  }

  if (regexSpace.test(password) === true) {
    errors.push({
      field: "password",
      message: "password can't contain space characters",
    });
  }

  return errors;
};
