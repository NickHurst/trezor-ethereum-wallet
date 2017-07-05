import R from 'ramda';

export const chomp: (item: string | any[]) => string | any[] = R.dropLast(1);

export const lchomp: (item: string | any[]) => string | any[] = R.drop(1);

export const toInt: (str: string) => number = str => parseInt(str);
