import _ from "lodash";

export const removeDuplicateArtists = (arr: any) => {
  var cleaned: any[] = [];
  arr.forEach(function (itm: any) {
    var unique = true;
    cleaned.forEach(function (itm2) {
      if (_.isEqual(itm.sp_band_name, itm2.sp_band_name)) {
        //console.log('itm: ', itm, ' itm2: ', itm2, ' isEqual: ', _.isEqual(itm.ticket_band, itm2.ticket_band));
        unique = false;
      }
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
};
