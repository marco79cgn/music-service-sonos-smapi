const soap = require("soap");
const { updateAudioBookshelfProgress } = require("./utils");
const express = require("express");
const config = require("./config");

/* CONFIG */
const EXPRESS_APP = express();
const SONOS_SOAP_SERVICE = require("./sonos-service");
console.log("🚀 SONOS_SOAP_SERVICE:", SONOS_SOAP_SERVICE);
const HTTP_PORT = config.HTTP_PORT;
console.log("🚀 HTTP_PORT:", HTTP_PORT);
const SOAP_URI = config.SOAP_URI;
console.log("🚀 SOAP_URI:", SOAP_URI);
const SOAP_ENDPOINT = config.SOAP_ENDPOINT;
console.log("🚀 SOAP_ENDPOINT:", SOAP_ENDPOINT);
const SONOS_WSDL_FILE = config.SONOS_WSDL_FILE;

/**********/

EXPRESS_APP.use(express.json()); // express.json allows for native body parsing
EXPRESS_APP.listen(HTTP_PORT, function () {
  /* 
    SOAP server
    The Sonos Music API (SMAPI) uses SOAP rather than REST. All requests go to the /wsdl endpoint, where SOAP does SOAP magic
    and handles the different routes via the service (sonosService) defined in sonos-service.js
    
    SMAPI documentation: https://developer.sonos.com/reference/sonos-music-api/
  */
  var soaper = soap.listen(
    EXPRESS_APP,
    SOAP_ENDPOINT,
    SONOS_SOAP_SERVICE,
    SONOS_WSDL_FILE,
    function () {
      console.log("[soapServer] server initialized");
    }
  );

  soaper.log = function (type, data) {
    // uncomment to log SOAP requests coming in
    // console.log(data);
  };

  /*
    Sonos Cloud Queue Routes
    "Cloud Queue" is a misnomer here. These routes are only used for handling "reporting" (audiobook progress updates). These endpoints exist outside
    of the SMAPI / SOAP implementation above.
  */
  EXPRESS_APP.get("/manifest", (req, res) => {
    console.log("[soapServer] /manifest called");
    res.send({
      schemaVersion: "1.0",
      endpoints: [
        {
          type: "reporting",
          uri: `${SOAP_URI}/playback/v2.1/report`,
        },
      ],
    });
  });
});
