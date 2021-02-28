export const validateRegister = (email: string, password: string) => {
  if (!email.includes("@")) {
    return {
      errors: [
        {
          field: "email",
          message: "invalid email",
        },
      ],
    };
  }

  const regexLength = /^.{8,}$/;
  const regexUppercase = /^(?=.*?[A-Z]).{8,}$/;
  const regexLowercase = /^(?=.*?[a-z]).{8,}$/;
  const regexDigit = /^(?=.*?[0-9]).{8,}$/;
  const regexSpecialChar = /^(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}$/;
  const regexSpace = /[\s]+/;

  if (regexLength.test(password) === false) {
    return {
      errors: [
        {
          field: "password",
          message: "password must be at least 8 characters long",
        },
      ],
    };
  }
  if (regexUppercase.test(password) === false) {
    return {
      errors: [
        {
          field: "password",
          message: "password must contain an uppercase letter",
        },
      ],
    };
  }
  if (regexLowercase.test(password) === false) {
    return {
      errors: [
        {
          field: "password",
          message: "password must contain a lowercase letter",
        },
      ],
    };
  }
  if (regexDigit.test(password) === false) {
    return {
      errors: [
        {
          field: "password",
          message: "password must contain a digit number",
        },
      ],
    };
  }
  if (regexSpecialChar.test(password) === false) {
    return {
      errors: [
        {
          field: "password",
          message: "password must contain a special character",
        },
      ],
    };
  }
  if (regexSpace.test(password) === true) {
    return {
      errors: [
        {
          field: "password",
          message: "password can't contain space characters",
        },
      ],
    };
  }

  return null;
};
