const Validator = require('validator'),
  isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  const errors = {};
  let { title, company, from } = data;

  company = !isEmpty(company) ? company : '';
  title = !isEmpty(title) ? title : '';
  from = !isEmpty(from) ? from : '';

  if (Validator.isEmpty(title)) {
    errors.title = 'Title field is required';
  }
  if (Validator.isEmpty(company)) {
    errors.company = 'Company field is required';
  }
  if (Validator.isEmpty(from)) {
    errors.from = 'From field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
