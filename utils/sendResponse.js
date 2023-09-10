export const sendResponse = (req, res, filename, data, statusCode = 200) => {
  const responseType = req.accepts(["html", "json"]);
  if (responseType === "html") {
    res.render(filename, data);
  } else if (responseType === "json") {
    res.status(statusCode).json({
      success: true,
      ...data,
    });
  } else {
    console.log("response error");
  }
};
