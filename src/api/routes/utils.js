const send500ErrorResponse = (res, errorMsg) => {
  res.status(500).json({
    message: "Unable to process request. Please try after sometime",
    error: errorMsg
  });
};

const send400ErrorResponse = (res, text) => {
  res.status(400).json({
    message: text ? text : "Invalid request",
  });
};

const sendResponse = (res, status, statusMsg, dataObj) => {
  res.status(status).json({
    message: statusMsg,
    data: dataObj
  });
};

module.exports = {send400ErrorResponse, send500ErrorResponse, sendResponse};
