import { PurchaseOrderItem, Item } from "../entity";
import { IDI } from "../interface";
import { InsertResult, Repository } from "typeorm";
import { ItemService } from "./itemService";

export class PurchaseOrderItemService {
    private static purchaseOrderItemRepository: Repository<PurchaseOrderItem> = null;
    private static itemService: ItemService = null;

    constructor(di: IDI) {
        if (PurchaseOrderItemService.purchaseOrderItemRepository === null) {
            PurchaseOrderItemService.purchaseOrderItemRepository = di.appTypeOrm.getConnection().getRepository(PurchaseOrderItem);
        }

        if (PurchaseOrderItemService.itemService === null) {
            PurchaseOrderItemService.itemService = new ItemService(di);
        }
    }

    public async create(data: PurchaseOrderItem): Promise<PurchaseOrderItem> {
        const purchaseOrderItem = new PurchaseOrderItem();
        purchaseOrderItem.purchaseOrderId = data.purchaseOrderId;
        purchaseOrderItem.itemId = data.itemId;
        purchaseOrderItem.price = data.price;
        purchaseOrderItem.qty = data.qty;
        try {
            const PurchaseOrderItemResponse = await PurchaseOrderItemService.purchaseOrderItemRepository.save(purchaseOrderItem);
        
            const item = new Item();
            item.id = purchaseOrderItem.itemId;
            item.date = new Date();
            item.price = purchaseOrderItem.price;
            item.qty = purchaseOrderItem.qty;

            await PurchaseOrderItemService.itemService.update(item);

            return PurchaseOrderItemResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async createBulk(purchaseOrderId: number, items: PurchaseOrderItem[]): Promise<InsertResult> {
        const purchaseOrderItems = items.map(item => {
            return {
                purchaseOrderId: purchaseOrderId,
                itemId: item.itemId,
                price: item.price,
                qty: item.qty
            };
        });

        try {
            const PurchaseOrderItemResponse = await PurchaseOrderItemService.purchaseOrderItemRepository
                .createQueryBuilder()
                .insert()
                .into(PurchaseOrderItem)
                .values(purchaseOrderItems)
                .execute();

            const itemsResponse = await PurchaseOrderItemService.itemService.findAll();

            const itemsArr = items.map(item => {
                const idx = itemsResponse.findIndex(i => i.id === item.itemId);
                item.qty = item.qty + itemsResponse[idx].qty;
                return `(${item.itemId}, ${new Date().toLocaleDateString('en-CA')}, ${item.price}, ${item.qty})`;
            });
            const itemsStr = itemsArr.join(', ');

            await PurchaseOrderItemService.purchaseOrderItemRepository.query(`
                INSERT into item (id, date, price, qty)
                VALUES ${itemsStr}
                ON DUPLICATE KEY UPDATE qty = VALUES(qty);
            `);

            return PurchaseOrderItemResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}