import { capitalize } from "next-dato-utils/utils";
import { format } from "date-fns";
import React from "react";
import { sv } from 'date-fns/locale';
import { TZDate } from "@date-fns/tz";
import { setDefaultOptions } from 'date-fns/setDefaultOptions';

export const chunkArray = (array: any[] | React.ReactNode[], chunkSize: number) => {
  const newArr = []
  for (let i = 0; i < array.length; i += chunkSize)
    newArr.push(array.slice(i, i + chunkSize));
  return newArr
}

export const recordToSlug = (record: any): string => {

  let url;

  if (!record) {
    throw new Error('recordToSlug: Record  is empty')
  }

  if (typeof record === 'string')
    return record
  else {
    const { __typename, slug } = record

    switch (__typename) {
      case 'ProgramRecord':
        url = `/${slug}`
        break;
      default:
        throw Error(`${__typename} is unknown record slug!`)
    }
  }

  return url
}

export const formatDate = (date: string, endDate?: string) => {
  if (!date) return '';
  setDefaultOptions({ locale: sv });

  const sDate = new TZDate(date, 'Europe/Stockholm');
  const eDate = endDate ? new TZDate(endDate, 'Europe/Stockholm') : undefined;

  const s = capitalize(format(sDate, 'd MMM')).replace('.', '');
  const e = eDate ? capitalize(format(eDate, 'd MMM')).replace('.', '') : undefined;

  // Jämför datumen utan tid
  const isSameDate = eDate && sDate.toDateString() === eDate.toDateString();

  return `${s}${e && !isSameDate ? ` – ${e}` : ''}`;
};

export const formatDateTime = (date: string) => {
  if (!date) return ''
  setDefaultOptions({ locale: sv });
  console.log(date)
  return capitalize(format(new TZDate(date, 'Europe/Stockholm'), 'd MMM, HH:mm')).replace('.', '');
}