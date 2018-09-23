const Validator = require('validator'),
  isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  const errors = {};
  let { text } = data;

  text = !isEmpty(text) ? text : '';

  if (!Validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
