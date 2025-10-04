import { Request } from "express";

export class BaseRepository<T> {
    protected model: any;
    protected _page = 1;
    protected _limit = 10;
    protected _skip = 0;
    protected _usePagination = false;

    constructor(model: any) {
        this.model = model;
    }

    public paginateFromReq(req?: Request) {
        if (req) {
            this._page = parseInt(req.query.page as string) || 1;
            this._limit = parseInt(req.query.limit as string) || 10;
            this._skip = (this._page - 1) * this._limit;
            this._usePagination = true;
        }
        return this;
    }

    public page(page: number) {
        this._page = page;
        this._skip = (page - 1) * this._limit;
        this._usePagination = true;
        return this;
    }

    public limit(limit: number) {
        this._limit = limit;
        this._usePagination = true;
        return this;
    }

    public skip(skip: number) {
        this._skip = skip;
        this._usePagination = true;
        return this;
    }

    public async findAll(extraArgs: any = {}) {
        if (!this._usePagination) {
            return this.model.findMany(extraArgs);
        }

        const data = await this.model.findMany({
            skip: this._skip,
            take: this._limit,
            ...extraArgs,
        });

        const { where } = extraArgs;
        const total = await this.model.count({ where });

        return {
            data,
            total,
            page: this._page,
            limit: this._limit,
            lastPage: Math.ceil(total / this._limit),
        };
    }
}
