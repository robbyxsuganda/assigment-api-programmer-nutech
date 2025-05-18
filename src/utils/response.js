module.exports = {
  success(res, data, message) {
    res.status(200).json({
      status: 200,
      message,
      data,
    });
  },
  error(res, error, message) {
    console.log(error, "error di error handler");

    res.status(500).json({
      status: 500,
      message,
      data: error,
    });
  },
  notFound(res, message = "not found") {
    res.status(404).json({
      status: 404,
      message,
      data: null,
    });
  },
  unauthorized(res, message = "unauthorized") {
    res.status(401).json({
      status: 401,
      message,
      data: null,
    });
  },
};
