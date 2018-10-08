const fs = require('fs');
const _ = require('lodash');
const xml2js = require('xml2js');

const config = require('./config');

let outData, outDataAll = {};

if (!fs.existsSync(config.outputFolder)) {
  fs.mkdirSync(config.outputFolder);
}

const xml = fs.readFileSync(config.inputFile, 'utf8');

const parser = new xml2js.Parser();
parser.parseString(xml, (error, result) => {

  let dists = result['行政區域界線']['gml:featureMember'];
  if (config.testingRun) dists = dists.slice(0, 5);
  dists.forEach(dist => {

    const distData = dist['PUB_行政區域'][0];
    const distCode = distData['行政區域代碼'][0];
    const distName = distData['名稱'][0];

    const coordinates = [];
    let coorCount = 0;
    let coorLngSum = 0;
    let coorLatSum = 0;

    distData['涵蓋範圍'][0]['gml:MultiPolygon'][0]['gml:polygonMember'].forEach((pm) => {
      let coorStr = pm['gml:Polygon'][0]['gml:outerBoundaryIs'][0]['gml:LinearRing'][0]['gml:coordinates'][0];
      let coor = coorStr.split(' ').map((c) => {
        let arr = c.split(',');
        let lng = Number(arr[0]);
        let lat = Number(arr[1]);
        if (config.percision >= 0) {
          lng = _.round(lng, config.percision);
          lat = _.round(lat, config.percision);
        }
        coorLngSum += lng;
        coorLatSum += lat;
        coorCount += 1;
        return [lng, lat];
      });
      if (config.percision >= 0) {
        coor = _.uniqWith(coor, _.isEqual);
        coor.push(coor[0]); // geometry 頭尾點必須相同
      }
      coordinates.push(coor);
    });

    // ref: https://zh.wikipedia.org/wiki/戶役政資訊系統資料代碼
    const outCityCode = /^(09|10)/.test(distCode.substr(0, 2)) ? distCode.substr(0, 5) : distCode.substr(0, 2);

    if (!outDataAll[outCityCode]) outDataAll[outCityCode] = {
      type: 'FeatureCollection',
      features: []
    };
    outDataAll[outCityCode].features.push({
      type: 'Feature',
      properties: {
        name: distName,
        id: distData['行政區域代碼'][0],
        type: 'TaiwanDistrictBoundary',
        centerLng: coorLngSum / coorCount,
        centerLat: coorLatSum / coorCount,
      },
      geometry: {
        type: 'Polygon',
        coordinates: coordinates.concat()
      }
    });

    console.log(`done: ${distName}`);
  });

  for (const key in outDataAll) {
    if (outDataAll.hasOwnProperty(key)) {
      const element = outDataAll[key];
      fs.writeFileSync(`${config.outputFolder}/${key}.json`, JSON.stringify(element));
    }
  }
});