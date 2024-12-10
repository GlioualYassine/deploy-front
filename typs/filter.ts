export type Filter = {
  currentPage: number ;
  size: number;
  globalSearch?: string;
};

export const defaultFilter: Filter = {
    currentPage: 1,
    size: 10,
    globalSearch: "",
  };