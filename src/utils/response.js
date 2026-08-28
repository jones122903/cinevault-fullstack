// utils/response.js

exports.sendResponse = (
  res,
  { statusCode = 200, status = "success", data = null, message = "" }
) => {
  res.status(statusCode).json({
    status,
    data,
    message,
  });
};
