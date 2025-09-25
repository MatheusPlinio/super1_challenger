import { Request } from "express";

export interface IPaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    lastPage: number;
}

export interface IBaseRepository<T> {
    paginateFromReq(req?: Request): this;
    page(page: number): this;
    limit(limit: number): this;
    skip(skip: number): this;

    findAll(extraArgs?: object): Promise<IPaginatedResult<T> | T[]>;
}