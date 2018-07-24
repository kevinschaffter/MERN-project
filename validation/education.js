const Validator = require('validator'),
  isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  const errors = {};
  let { school, degree, from, fieldofstudy } = data;

  school = !isEmpty(school) ? school : '';
  degree = !isEmpty(degree) ? degree : '';
  from = !isEmpty(from) ? from : '';
  fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : '';

  if (Validator.isEmpty(school)) {
    errors.school = 'School field is required';
  }
  if (Validator.isEmpty(degree)) {
    errors.degree = 'Degree field is required';
  }
  if (Validator.isEmpty(from)) {
    errors.from = 'From field is required';
  }
  if (Validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
