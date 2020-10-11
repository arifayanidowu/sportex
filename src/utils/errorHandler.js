module.exports = errorHandler = async (response, code = 500, message) => {
  return response.status(code).send({
    status: false,
    message,
  });
};
