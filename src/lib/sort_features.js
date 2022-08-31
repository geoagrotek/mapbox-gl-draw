import area from "@mapbox/geojson-area";
import * as Constants from "../constants";

const FEATURE_SORT_RANKS = {
  Point: 0,
  LineString: 1,
  Polygon: 2,
};

function comparator(a, b) {
  const score =
    FEATURE_SORT_RANKS[a.geometry.type.replace("Multi", "")] -
    FEATURE_SORT_RANKS[b.geometry.type.replace("Multi", "")];

  if (score === 0 && a.geometry.type === Constants.geojsonTypes.POLYGON) {
    return a.area - b.area;
  }

  return score;
}

// Sort in the order above, then sort polygons by area ascending.
function sortFeatures(features) {
  return features
    .map((feature) => {
      if (
        feature.geometry.type === Constants.geojsonTypes.POLYGON ||
        feature.geometry.type === Constants.geojsonTypes.MULTI_POLYGON
      ) {
        feature.area = area.geometry({
          type: Constants.geojsonTypes.FEATURE,
          property: {},
          geometry: feature.geometry,
        });
      }
      return feature;
    })
    .sort(comparator)
    .map((feature) => {
      delete feature.area;
      return feature;
    });
}

export default sortFeatures;
