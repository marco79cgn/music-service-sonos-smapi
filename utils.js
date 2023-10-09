const stations = require("./ard-stations.json");

async function buildLibraryMetadataResult(res) {
  let mediaMetadata = [];

  for (const station of stations) {
    var mediaMetadataEntry = {
      itemType: "stream",
      id: station.id,
      title: station.title,
      streamMetadata: {
        logo: station.images[0].url
      }
    };
    mediaMetadata.push(mediaMetadataEntry);
  }

  return {
    getMetadataResult: {
      count: stations.length,
      total: stations.length,
      index: 0,
      mediaMetadata: mediaMetadata, // Adjusted here
    },
  };
}

async function buildLibraryMediaMetadataResult(res) {
  // console.log("id: " + res.id)
  var selectedStation = stations.find(el => el.id === res.id)
  return {
    getMediaMetadataResult: {
      id: selectedStation.id,
      itemType: "stream",
      title: selectedStation.title,
      mimeType: "audio/mp3",
      streamMetadata: {
        logo: selectedStation.images[0].url
      }
    },
  };
}

// Methods to invoke
async function getMediaURI(id) {
  var station = stations.find(el => el.id === id)
  return {
    getMediaURIResult: station.binaries[0].href,
  }
}

async function getMetadataResult(libraryItemId) {
    return await buildLibraryMetadataResult();
}

async function getMediaMetadataResult(libraryItemId) {
  return await buildLibraryMediaMetadataResult(libraryItemId);
}

module.exports = {
  getMetadataResult,
  getMediaMetadataResult,
  getMediaURI,
};
