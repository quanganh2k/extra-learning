import * as moment from 'moment';

export const specifyDayOfWeek = (value: string) => {
  switch (value) {
    case 'Thứ 2':
      return 1;

    case 'Thứ 3':
      return 2;

    case 'Thứ 4':
      return 3;

    case 'Thứ 5':
      return 4;

    case 'Thứ 6':
      return 5;

    case 'Thứ 7':
      return 6;

    case 'Chủ nhật':
      return 0;

    default:
      return 1;
  }
};

export const countDayOccurrences = (
  year: number,
  month: number,
  daysArr: number[],
) => {
  const firstDayOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
  const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');

  let count = 0;
  for (
    let currentDay = firstDayOfMonth;
    currentDay.isSameOrBefore(lastDayOfMonth);
    currentDay.add(1, 'day')
  ) {
    if (daysArr.includes(currentDay.day())) {
      count++;
    }
  }

  return count;
};
