import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IProductRepository } from '../repositories/contracts/IProductRepository';

export class ProductController {
    constructor(private repo: IProductRepository) { }

    async index(req: Request, res: Response) {
        try {
            this.repo.paginateFromReq(req);
            const search = (req.query.search as string) || '';
            const result = await this.repo.search(search);
            return res.status(StatusCodes.OK).json(result);
        } catch (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to list products' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const product = await this.repo.findById(id);

            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
            }

            return res.status(StatusCodes.OK).json({ data: product });
        } catch (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get product' });
        }
    }
}
