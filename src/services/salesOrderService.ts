import { SalesOrder, SalesOrderItem } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { SalesOrderItemService } from "./salesOrderItemService";

export class SalesOrderService {
    private static salesOrderRepository: Repository<SalesOrder> = null;
    private static salesOrderItemService: SalesOrderItemService = null;

    constructor(di: IDI) {
        if (SalesOrderService.salesOrderRepository === null) {
            SalesOrderService.salesOrderRepository = di.appTypeOrm.getConnection().getRepository(SalesOrder);
        }
        
        if (SalesOrderService.salesOrderItemService === null) {
            SalesOrderService.salesOrderItemService = new SalesOrderItemService(di);
        }
    }

    public async create(data: SalesOrder): Promise<SalesOrder> {
        const salesOrder = new SalesOrder();
        salesOrder.date = data.date;
        salesOrder.customer_id = data.customer_id;
        try {
            const salesOrderResponse = await SalesOrderService.salesOrderRepository.save(salesOrder);
            const salesOrderItem = new SalesOrderItem();
            
            for(let i = 0; i < data.items.length; i++) {
                salesOrderItem.sales_order_id = salesOrderResponse.id;
                salesOrderItem.item_id = data.items[i].item_id;
                salesOrderItem.price = data.items[i].price;
                salesOrderItem.qty = data.items[i].qty;
                
                await SalesOrderService.salesOrderItemService.create(salesOrderItem);
            }
            return salesOrderResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}