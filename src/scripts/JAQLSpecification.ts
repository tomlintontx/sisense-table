export type JAQL = {
  datasource: string;
  metadata: JAQLElement[];
  format?: string | undefined;
  offset?: number | undefined;
  count?: number | undefined;
  csvSeparator?: string | undefined;
  isMaskedResponse?: boolean | undefined;
};

export type JAQLElement = Dimension | Formula;

export type RelativeDateFilter = {
  count?: number;
  offset?: number;
  anchor?: string;
};

export type JAQLFilter = {
  // Members filter
  members?: string[];

  // Text Filters
  equals?: string | number;
  doesntEqual?: string | number;
  contains?: string;
  doesntContain?: string;
  startsWith?: string;
  doesntStartWith?: string;
  endsWith?: string;
  doesntEndWidth?: string;
  like?: string;

  // Mathematical Filters
  from?: number;
  fromNotEqual?: number;
  to?: number;
  toNotEqual?: number;

  // Relative Date Filters
  last?: RelativeDateFilter;
  next?: RelativeDateFilter;

  // Top/Bottom Filters
  top?: number;
  bottom?: number;
  by?: JAQLElement;

  // Negative Filters
  exclude?: JAQLFilter;

  // Combining Filters
  or?: JAQLFilter[];
  and?: JAQLFilter[];
};

export type SimpleAggregation =
  | "avg"
  | "count"
  | "countduplicates"
  | "min"
  | "max"
  | "median"
  | "stdev"
  | "stdevp"
  | "sum"
  | "var"
  | "varp";

export type DateLevel =
  | "years"
  | "quarters"
  | "months"
  | "days"
  | "hours"
  | "minutes"
  | "timestamp";

export type Dimension = {
  dim: string;
  level?: DateLevel;
  agg?: SimpleAggregation;
  filter?: JAQLFilter;
  panel?: "scope";
  title?: string;
};

export type Formula = {
  formula: string;
  context: { [key: string]: Dimension };
  title?: string;
};
