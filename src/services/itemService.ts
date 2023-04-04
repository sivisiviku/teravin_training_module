import { Item } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { DataNotFoundError } from "../error";
import Big from 'big.js';

export class ItemService {
    private static itemRepository: Repository<Item> = null;

    constructor(di: IDI) {
        if (ItemService.itemRepository === null) {
            ItemService.itemRepository = di.appTypeOrm.getConnection().getRepository(Item);
        }
    }

    public async findAll(): Promise<Item[]> {
        return await ItemService.itemRepository.find();
    }

    public async findById(id: number): Promise<Item> {
        try {
            return await ItemService.itemRepository.findOne({
                where: {
                    id,
                },
            });
        } catch (e) {
            console.log(e);
            throw new DataNotFoundError("Invalid code");
        }
    }

    public async update(newItem: Item): Promise<Item> {
        const item: Item = await this.findById(newItem.id);
        if (item == null) {
            throw new DataNotFoundError(`Customer not found: ${newItem.id}`);
        }

        const currentQty = new Big(item.qty);
        const newQty = new Big(newItem.qty);

        item.qty = Number(JSON.stringify(currentQty.plus(newQty)).replace(/['"]+/g, ''));

        return await ItemService.itemRepository.save(item);
    }
}