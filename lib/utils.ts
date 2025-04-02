import { capitalize } from "next-dato-utils/utils";
import { format } from "date-fns";
import React from "react";
import { sv } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';

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
  if (!date) return ''
  setDefaultOptions({ locale: sv });
  const s = capitalize(format(new Date(date), 'dd MMM')).replace('.', '');
  const e = endDate ? capitalize(format(new Date(endDate), 'dd MMM')).replace('.', '') : undefined;
  return `${s}${e ? ` – ${e}` : ''}`
}

export const formatDateTime = (date: string) => {
  if (!date) return ''
  setDefaultOptions({ locale: sv });
  return capitalize(format(new Date(date), 'dd MMM, HH:mm')).replace('.', '');
}