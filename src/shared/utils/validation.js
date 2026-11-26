import { TEXT } from 'config/text';
export const is = {
  match: (testFn, message = '') => (value, fieldValues) => !testFn(value, fieldValues) && message,

  required: () => value => isNilOrEmptyString(value) && TEXT.errors.required,

  minLength: min => value => !!value && value.length < min && TEXT.errors.minLength(min),

  maxLength: max => value => !!value && value.length > max && TEXT.errors.maxLength(max),

  notEmptyArray: () => value =>
    Array.isArray(value) && value.length === 0 && TEXT.errors.atLeastOne,

  email: () => value => !!value && !/.+@.+\..+/.test(value) && TEXT.errors.email,

  url: () => value =>
    !!value &&
    // eslint-disable-next-line no-useless-escape
    !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value) &&
    TEXT.errors.url,
};

const isNilOrEmptyString = value => value === undefined || value === null || value === '';

export const generateErrors = (fieldValues, fieldValidators) => {
  const errors = {};

  Object.entries(fieldValidators).forEach(([fieldName, validators]) => {
    [validators].flat().forEach(validator => {
      const errorMessage = validator(fieldValues[fieldName], fieldValues);
      if (errorMessage && !errors[fieldName]) {
        errors[fieldName] = errorMessage;
      }
    });
  });
  return errors;
};
