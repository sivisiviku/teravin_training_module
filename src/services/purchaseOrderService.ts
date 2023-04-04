import { PurchaseOrder } from "../entity";
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
        purchaseOrder.supplierId = data.supplierId;
        try {
            const purchaseOrderResponse = await PurchaseOrderService.purchaseOrderRepository.save(purchaseOrder);
            
            await PurchaseOrderService.purchaseOrderItemService.createBulk(purchaseOrderResponse.id, data.items); 

            return purchaseOrderResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}