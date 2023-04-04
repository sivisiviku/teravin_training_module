import { SalesOrderItem, Item } from "../entity";
import { IDI } from "../interface";
import { InsertResult, Repository } from "typeorm";
import { ItemService } from "./itemService";

export class SalesOrderItemService {
    private static salesOrderItemRepository: Repository<SalesOrderItem> = null;
    private static itemService: ItemService = null;

    constructor(di: IDI) {
        if (SalesOrderItemService.salesOrderItemRepository === null) {
            SalesOrderItemService.salesOrderItemRepository = di.appTypeOrm.getConnection().getRepository(SalesOrderItem);
        }

        if (SalesOrderItemService.itemService === null) {
            SalesOrderItemService.itemService = new ItemService(di);
        }
    }

    public async create(data: SalesOrderItem): Promise<SalesOrderItem> {
        const salesOrderItem = new SalesOrderItem();
        salesOrderItem.salesOrderId = data.salesOrderId;
        salesOrderItem.itemId = data.itemId;
        salesOrderItem.price = data.price;
        salesOrderItem.qty = data.qty;
        try {
            const salesOrderItemResponse = await SalesOrderItemService.salesOrderItemRepository.save(salesOrderItem);
        
            const item = new Item();
            item.id = salesOrderItem.itemId;
            item.date = new Date();
            item.price = salesOrderItem.price;
            item.qty = -salesOrderItem.qty;

            await SalesOrderItemService.itemService.update(item);
            
            return salesOrderItemResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async createBulk(salesOrderId: number, items: SalesOrderItem[]): Promise<InsertResult> {
        const salesOrderItems = items.map(item => {
            return {
                salesOrderId: salesOrderId,
                itemId: item.itemId,
                price: item.price,
                qty: item.qty
            };
        });

        try {
            const SalesOrderItemResponse = await SalesOrderItemService.salesOrderItemRepository
                .createQueryBuilder()
                .insert()
                .into(SalesOrderItem)
                .values(salesOrderItems)
                .execute();

            const itemsResponse = await SalesOrderItemService.itemService.findAll();

            const itemsArr = items.map(item => {
                const idx = itemsResponse.findIndex(i => i.id === item.itemId);
                item.qty = itemsResponse[idx].qty - item.qty;
                return `(${item.itemId}, ${new Date().toLocaleDateString('en-CA')}, ${item.price}, ${item.qty})`;
            });
            const itemsStr = itemsArr.join(', ');

            await SalesOrderItemService.salesOrderItemRepository.query(`
                INSERT into item (id, date, price, qty)
                VALUES ${itemsStr}
                ON DUPLICATE KEY UPDATE qty = VALUES(qty);
            `);

            return SalesOrderItemResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}