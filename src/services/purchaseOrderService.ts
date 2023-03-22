import { PurchaseOrder, PurchaseOrderItem } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { PurchaseOrderItemService } from "./purchaseOrderItemService";

export class PurchaseOrderService {
    private static purchaseOrderRepository: Repository<PurchaseOrder> = null;
    private static purchaseOrderItemService: PurchaseOrderItemService = null;

    constructor(di: IDI) {
        if (PurchaseOrderService.purchaseOrderRepository === null) {
            PurchaseOrderService.purchaseOrderRepository = di.appTypeOrm.getConnection().getRepository(PurchaseOrder);
        }
        
        if (PurchaseOrderService.purchaseOrderItemService === null) {
            PurchaseOrderService.purchaseOrderItemService = new PurchaseOrderItemService(di);
        }
    }

    public async create(data: PurchaseOrder): Promise<PurchaseOrder> {
        const purchaseOrder = new PurchaseOrder();
        purchaseOrder.date = data.date;
        purchaseOrder.supplier_id = data.supplier_id;
        try {
            const purchaseOrderResponse = await PurchaseOrderService.purchaseOrderRepository.save(purchaseOrder);
            const purchaseOrderItem = new PurchaseOrderItem();
            
            for(let i = 0; i < data.items.length; i++) {
                purchaseOrderItem.purchase_order_id = purchaseOrderResponse.id;
                purchaseOrderItem.item_id = data.items[i].item_id;
                purchaseOrderItem.price = data.items[i].price;
                purchaseOrderItem.qty = data.items[i].qty;
                
                await PurchaseOrderService.purchaseOrderItemService.create(purchaseOrderItem);
            }
            return purchaseOrderResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}