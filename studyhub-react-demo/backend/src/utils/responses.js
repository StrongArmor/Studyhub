const buildMeta = () => ({
  timestamp: new Date().toISOString()
});

export const sendSuccess = (res, data = null, message = 'Lấy dữ liệu thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
    meta: buildMeta()
  });
};

export const sendError = (res, statusCode = 500, message = 'Có lỗi xảy ra', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
    meta: buildMeta()
  });
};