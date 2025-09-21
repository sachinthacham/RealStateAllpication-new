export interface IPagination {
    page: number;
    limit: number;
    total?: number;
  }
  
  export interface IFilterQuery {
    [key: string]: any;
  }
  