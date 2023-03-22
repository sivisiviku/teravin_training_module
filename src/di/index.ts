// tslint:disable:max-line-length
import { Validator } from "le-validator";
import { PartialResponsify } from "partial-responsify";
import { Country, Currency, Customer, PurchaseOrder, PurchaseOrderItem, Item, SalesOrder, SalesOrderItem} from "../entity";
import { IDI } from "../interface";
import {
    Config,
    Helper,
    AppTypeOrm
} from "../lib";
import { CountryService, CurrencyService, CustomerService, PurchaseOrderService, PurchaseOrderItemService, 
    ItemService, SalesOrderService, SalesOrderItemService} from "../services";

export const getAppTypeOrm = async (config: Config): Promise<AppTypeOrm> => {
    return new AppTypeOrm(await AppTypeOrm.getConnectionManager({
        database: config.dbDatabase,
        entities: [
            Currency,
            Country,
            Customer,
            PurchaseOrder,
            PurchaseOrderItem,
            Item,
            SalesOrder,
            SalesOrderItem
        ],
        host: config.dbHost,
        logging: config.dbLogging,
        password: config.dbPassword,
        type: config.dbType,
        username: config.dbUsername,
    }));
};

export const getDiComponent = async (config: Config): Promise<IDI> => {
    const di: IDI = {
        appTypeOrm: await getAppTypeOrm(config),
        config,
        helper: new Helper(),
        partialResponsify: new PartialResponsify(),
        validator: new Validator(),
        countryService: null,
        currencyService: null,
        customerService: null,
        purchaseOrderService: null,
        purchaseOrderItemService: null,
        itemService: null,
        salesOrderService: null,
        salesOrderItemService: null,
    };

    di.currencyService = new CurrencyService(di);
    di.countryService = new CountryService(di);
    di.customerService = new CustomerService(di);
    di.purchaseOrderService = new PurchaseOrderService(di);
    di.purchaseOrderItemService = new PurchaseOrderItemService(di);
    di.itemService = new ItemService(di);
    di.salesOrderService = new SalesOrderService(di);
    di.salesOrderItemService = new SalesOrderItemService(di);
    return di;
};
