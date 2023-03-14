const validate = (schema, userInput) => {
    return schema.validateAsync(userInput, { abortEarly: false });
  };
  
  module.exports = validate;