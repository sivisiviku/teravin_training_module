import { SalesOrder } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { SalesOrderItemService } from "./salesOrderItemService";
import { ItemService } from "./itemService";

export class SalesOrderService {
    private static salesOrderRepository: Repository<SalesOrder> = null;
    private static salesOrderItemService: SalesOrderItemService = null;
    private static itemService: ItemService = null;

    constructor(di: IDI) {
        if (SalesOrderService.salesOrderRepository === null) {
            SalesOrderService.salesOrderRepository = di.appTypeOrm.getConnection().getRepository(SalesOrder);
        }
        
        if (SalesOrderService.salesOrderItemService === null) {
            SalesOrderService.salesOrderItemService = new SalesOrderItemService(di);
        }

        if (SalesOrderService.itemService === null) {
            SalesOrderService.itemService = new ItemService(di);
        }
    }

    public async create(data: SalesOrder): Promise<SalesOrder> {
        const salesOrder = new SalesOrder();
        salesOrder.date = data.date;
        salesOrder.customerId = data.customerId;
        try {
            for(let i = 0; i < data.items.length; i++) {
                const itemResponse = await SalesOrderService.itemService.findById(data.items[i].itemId);

                if(itemResponse.qty-data.items[i].qty < 0) {
                    return null;
                }
            }

            const salesOrderResponse = await SalesOrderService.salesOrderRepository.save(salesOrder);
            
            await SalesOrderService.salesOrderItemService.createBulk(salesOrderResponse.id, data.items); 

            return salesOrderResponse;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async delete(data: SalesOrder): Promise<SalesOrder> {
        await SalesOrderService.salesOrderRepository.delete(data.id);
        return data;
    }
}