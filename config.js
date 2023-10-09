const fs = require("fs");
require("dotenv").config();

module.exports = Object.freeze({
  HTTP_PORT: 8081, // what port to for express to listen on. Where your SOAP && HTTP requests should end up
  SOAP_ENDPOINT: "/wsdl", // what endpoint sonos will reach out to. Defined in the custom service descriptor
  SONOS_WSDL_FILE: fs.readFileSync("sonos.wsdl", "utf8"),
  SOAP_URI: "http://192.168.178.71", // https://yoursoap.url.com
  ABS_URI: process.env.ABS_URI, // http://your.url.com
  ABS_LIBRARY_ID: process.env.ABS_LIBRARY_ID, // lib_*****
  ABS_TOKEN: process.env.ABS_TOKEN, // ABS -> settings -> users -> select user -> API TOKEN
});
