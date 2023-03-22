import { PurchaseOrderItem, Item } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
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
        purchaseOrderItem.purchase_order_id = data.purchase_order_id;
        purchaseOrderItem.item_id = data.item_id;
        purchaseOrderItem.price = data.price;
        purchaseOrderItem.qty = data.qty;
        try {
            const PurchaseOrderItemResponse = await PurchaseOrderItemService.purchaseOrderItemRepository.save(purchaseOrderItem);
        
            const item = new Item();
            item.id = purchaseOrderItem.item_id;
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
}