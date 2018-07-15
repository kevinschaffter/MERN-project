const Validator = require("validator"),
  isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  const errors = {};
  let { handle, status, skills } = data;

  handle = !isEmpty(handle) ? handle : "";
  status = !isEmpty(status) ? status : "";
  skills = !isEmpty(skills) ? skills : "";

  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 4 characters";
  }
  if (Validator.isEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }
  if (Validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }
  if (Validator.isEmpty(skills)) {
    errors.skills = "skills field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
