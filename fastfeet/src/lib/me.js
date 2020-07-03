import { toDate } from 'date-fns';

function convertDateFormat(date, timezone){
      // expected format for date parameters: day/mouth/year hour:minute
      // expected format for timezone parameters: 3
      
      const array = date.split(/[\s/:]+/);
      if (timezone) {
        const d = toDate(
          new Date(
            array[2],
            array[1] - 1,
            array[0],
            array[3] - timezone,
            array[4],
            0
          )
        );
        return d;
      }
      const d = toDate(
        new Date(array[2], array[1] - 1, array[0], array[3], array[4], 0)
      );
      return d;
}


module.exports = {
  convertDateFormat,
}
