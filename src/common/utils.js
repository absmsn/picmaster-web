import {baseUrl} from "./config";

// 将一个数组按照日期分成不同的组
export const groupDataByDate = function (data, dateFn) {
  let map = new Map();
  let groups = [];
  for(var d of data) {
    let date = (new Date(dateFn(d))).toLocaleDateString();
    if (map.has(date)) {
      var group = map.get(date);
      group.data.push(d);
    } else {
      let group = {
        title: date,
        data: [d]
      }
      groups.push(group);
      map.set(date, group);
    }
  }
  return groups;
}

export const mergeGroupArr = function (groupArr1, groupArr2, arrFn, keyFn) {
  let map = new Map();
  let groupArr = groupArr1.slice();
  for (let i = 0; i < groupArr.length; i++) {
    let g = arrFn(groupArr[i]);
    map.set(keyFn(g), g);
  }
  for (let group of groupArr2) {
    const key = keyFn(group);
    if (map.has(key)) {
      let g = map.get(key);
      Array.prototype.push.apply(g, arrFn(group));
    } else {
      groupArr.push(group);
    }
  }
  return groupArr;
}

export const processPhotoInfo = function (info, photoSize, format) {
  const photoID = info.photoID;
  return Object.assign(info, {
    photoUrl: getPhotoUrl(photoID),
    thumbnailUrl: getThumbnailURL(photoID, photoSize, photoSize, format)
  });
}

export const getThumbnailURL = function (photoID, width, height, format) {
  const f = format ? `format=${format}` : "";
  return `${baseUrl}/photo/${photoID}/thumbnail?width=${width}&height=${height}&${f}`
}

export const getPhotoUrl = function (photoID) {
  return `${baseUrl}/photo/${photoID}`;
}

export const getGridSizeNum = function (minGridNum, maxGridSize, gapSize, fullLength) {
  let gridNum = Math.ceil((fullLength - gapSize) / (gapSize + maxGridSize));
  if (gridNum < minGridNum) {
    gridNum = minGridNum;
  }
  let gridSize = Math.floor((fullLength - (gridNum + 1) * gapSize) / gridNum);
  return {gridSize, gridNum};
}