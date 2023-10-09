const { getMetadataResult, getMediaURI, getMediaMetadataResult} = require("./utils");

var sonosService = {
  Sonos: {
    SonosSoap: {
      getMetadata: function (args) {
        let type = args["id"]; // "root" or abs library item id "li_laksjdfklasdj"
        console.log("getMetadata args: " + JSON.stringify(args));
        switch (type) {
          case "root": // first request after selecting "ARD Audiothek" in the app. Returns the list of stations for now > folders in the future
            return getMetadataResult(type);
          default: // request after selecting a specific item inside a subfolder
            return getMetadataResult(type); // this needs to be the same method due to SOAP doing SOAP things for the XML with the function name
        }
      },
      getMediaMetadata: function (args) {
        console.log("getMediaMetadata called with args " + JSON.stringify(args));
        return getMediaMetadataResult(args);
      },
      // get the actual URI of the radio station
      getMediaURI: function (args) {
        console.log("getMediaURI called with args " + JSON.stringify(args));
        return getMediaURI(args["id"]);
      },
      getLastUpdate: function (args) {
        return {
          getLastUpdateResult: {
            catalog: `${Date.now()}`, // just force update every single time :D
            autoRefreshEnabled: true,
            favorites: `${Date.now()}`,
            pollInterval: 10,
          },
        };
      },
    },
  },
};

module.exports = sonosService;
