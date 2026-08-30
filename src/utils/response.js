// utils/response.js

exports.sendResponse = (
  res,
  {
    statusCode = 200,
    status = "success",
    data = null,
    message = "",
    total,
  }
) => {
  const response = {
    status,
    data,
    message,
  };

  // Include total only when it was provided
  if (total !== undefined) {
    response.total = Number(total);
  }

  res.status(statusCode).json(response);
};