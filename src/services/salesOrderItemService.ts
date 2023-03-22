import { SalesOrderItem, Item } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
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
        salesOrderItem.sales_order_id = data.sales_order_id;
        salesOrderItem.item_id = data.item_id;
        salesOrderItem.price = data.price;
        salesOrderItem.qty = data.qty;
        try {
            const salesOrderItemResponse = await SalesOrderItemService.salesOrderItemRepository.save(salesOrderItem);
        
            const item = new Item();
            item.id = salesOrderItem.item_id;
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
}