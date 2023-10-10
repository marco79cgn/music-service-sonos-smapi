const { getMetadataResult, getMediaURI, getMediaMetadataResult} = require("./utils");

var sonosService = {
  Sonos: {
    SonosSoap: {
      getMetadata: function (args) {
        let type = args["id"]; // "root" or station id
        switch (type) {
          case "root": // first request after selecting "ARD Audiothek" in the Sonos app. Returns the list of institutions as folders.
            return getMetadataResult(type);
          default: // request after selecting a specific item inside a folder
            return getMetadataResult(type);
        }
      },
      getMediaMetadata: function (args) {
        return getMediaMetadataResult(args);
      },
      // get the actual URI of the radio station
      getMediaURI: function (args) {
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
