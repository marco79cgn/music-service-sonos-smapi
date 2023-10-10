// noinspection JSUnresolvedReference

const providers = require("./providers.json");
const stations = require("./stations.json");

async function getMetadataResult(itemId) {
  return await buildMetadataResult(itemId);
}

async function getMediaMetadataResult(itemId) {
  return await buildMediaMetadataResult(itemId);
}

async function buildMetadataResult(itemId) {

  if(itemId === "root") {
    let mediaCollection = [];

    // add distinct providers as root playlists/folders
    for (const provider of providers) {
        const mediaMetadataEntry = {
          itemType: "playlist",
          id: provider.id,
          title: provider.title,
          albumArtURI: provider.imageURL
        };
        mediaCollection.push(mediaMetadataEntry);
    }
    return {
      getMetadataResult: {
        count: mediaCollection.length,
        total: mediaCollection.length,
        index: 0,
        mediaCollection: mediaCollection
      },
    };
  } else {
    return buildLibraryMetadataResult(itemId);
  }
}

async function buildLibraryMetadataResult(providerId) {
  let mediaMetadata = [];
  const channels = stations[providerId]

  for (const station of channels) {
      var mediaMetadataEntry = {
        itemType: "stream",
        id: station.id,
        title: station.name,
        streamMetadata: {
          logo: station.cover
        }
      };
      mediaMetadata.push(mediaMetadataEntry);
  }
  return {
    getMetadataResult: {
      count: mediaMetadata.length,
      total: mediaMetadata.length,
      index: 0,
      mediaMetadata: mediaMetadata
    },
  };
}

async function buildMediaMetadataResult(res) {

  const selectedStation = getStationById(res.id)

  return {
    getMediaMetadataResult: {
      id: selectedStation.id,
      itemType: "stream",
      title: selectedStation.name,
      streamMetadata: {
        logo: selectedStation.cover
      }
    },
  };
}

// Methods to invoke
async function getMediaURI(id) {
  const selectedStation = getStationById(id);
  console.log("Returning stream url for " + selectedStation.name + ": " + selectedStation.stream)
  return {
    getMediaURIResult: selectedStation.stream
  }
}

function getStationById(id) {
  const keys = Object.keys(stations);
  for (let i of keys) {
    if(stations[i].find(el => el.id === id)) {
      return stations[i].find(el => el.id === id)
    }
  }
  return "not found!"
}

module.exports = {
  getMetadataResult,
  getMediaMetadataResult,
  getMediaURI,
};
