export interface Filters {
  page: number;
  pageSize: number;
  search?: string;
  targetDay?: Date;
  from?: Date;
  to?: Date;
}

export enum Gender {
  Female = 0,
  Male = 1,
  Other = 2,
}
