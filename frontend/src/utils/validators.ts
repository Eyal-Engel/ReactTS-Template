// input: char
export const isDigit = (char: string): boolean => {
  return /\d/.test(char);
};

// input: char
export const isHebrewAlpha = (char: string): boolean => {
  return /[\u0590-\u05FF]/.test(char); // Unicode range for Hebrew letters
};

// input: char
export const isEnglishAlpha = (char: string): boolean => {
  return /[A-Za-z]/.test(char);
};

// input: string, int requiredLen
export const len = (str: string, requiredLen: number): boolean => {
  return str.length === requiredLen;
};

// input: string
export const isNotEmpty = (str: string): boolean => {
  return str.trim() !== "";
};

// min len and max len
export const isLenRange = (
  str: string,
  minLen: number,
  maxLen: number
): boolean => {
  const length = str.length;
  return length >= minLen && length <= maxLen;
};

export const VALIDATOR_PASSWORD = (value: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
};

interface PasswordValidationResult {
  password: boolean;
  secPassword: boolean;
  msg: string;
}

export const validationPasswordsErrorType = (
  password: string,
  confirmPassword: string
): PasswordValidationResult => {
  const passwordValidation = VALIDATOR_PASSWORD(password);
  const secPasswordValidation = VALIDATOR_PASSWORD(confirmPassword);
  const areIdentical = password === confirmPassword;

  if (areIdentical && passwordValidation && secPasswordValidation) {
    // Identical and valid
    return { password: true, secPassword: true, msg: "Identical and valid" };
  } else if (areIdentical && !passwordValidation) {
    // Identical but invalid
    return {
      password: false,
      secPassword: false,
      msg: "Identical but invalid",
    };
  } else if (!areIdentical && passwordValidation && !secPasswordValidation) {
    // Not identical, confirm password validation failed
    return {
      password: true,
      secPassword: false,
      msg: "Not identical, confirm password validation failed",
    };
  } else if (!areIdentical && secPasswordValidation && !passwordValidation) {
    // Not identical, password validation failed
    return {
      password: false,
      secPassword: false,
      msg: "Identical, password validation failed",
    };
  } else if (!areIdentical && !secPasswordValidation && !passwordValidation) {
    // Not identical, both invalid
    return {
      password: false,
      secPassword: false,
      msg: "Not identical, both invalid",
    };
  } else if (!areIdentical && secPasswordValidation && passwordValidation) {
    // Not identical, both valid
    return {
      password: true,
      secPassword: false,
      msg: "Not identical, both valid",
    };
  }

  // Default return in case none of the above conditions are met
  return { password: false, secPassword: false, msg: "Invalid state" };
};
