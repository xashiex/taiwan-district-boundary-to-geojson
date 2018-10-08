# Taiwan District Boundary to GeoJson

## 把台灣鄉鎮市區界線 GML 資料轉為 Google Map 可直接使用的 GeoJson 格式。

* 一個縣市一個檔，輸出檔名依[戶役政資訊系統資料代碼](https://zh.wikipedia.org/wiki/戶役政資訊系統資料代碼)命名。例如：台北市: 63.json, 新北市: 65.json, 新竹市: 10018.json

## demo
* https://xashiex.github.io/taiwan-district-boundary-to-geojson/
* ref: https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson

## usage
1. 下載資料: [鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441) > 資料下載網址: 其他
1. 把壓縮檔解開後的 `.gml` (ex: `TOWN_MOI_1061225.gml`) 放到 `data/input/` 下。
1. 修改設定檔(`config.js`)
1. 安裝 packages: `npm i`
1. 輸出資料: `npm start`
