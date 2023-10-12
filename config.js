const fs = require("fs");

module.exports = Object.freeze({
  HTTP_PORT: 8080, // what port to for express to listen on. Where your SOAP && HTTP requests should end up
  SOAP_ENDPOINT: "/wsdl", // what endpoint sonos will reach out to. Defined in the custom service descriptor
  SONOS_WSDL_FILE: fs.readFileSync("sonos.wsdl", "utf8"),
  SOAP_URI: "http://127.0.0.1" // https://yoursoap.url.com
});
