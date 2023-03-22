import { IAllRoute, IOpenApiRoute } from "../../../../interface";

// ROUTE CONTROLER IMPORTS
// GET ROUTES
import {openapiGetCountries, getCountries} from "./get/getCountries";
import {openapiGetCountryByCode, getCountryByCode} from "./get/getCountryByCode";
import {openapiGetCustomers, getCustomers} from "./get/getCustomers";
import {openapiGetCustomersById, getCustomersById} from "./get/getCustomersById";

// POST ROUTES
import {openapiPostCountries, postCountries} from "./post/postCountries";
import {openapiPostCustomers, postCustomers} from "./post/postCustomers";
import {openapiPostPurchaseOrder, postPurchaseOrder} from "./post/postPurchaseOrder";
import {openapiPostSalesOrder, postSalesOrder} from "./post/postSalesOrder";

// PUT ROUTES
import {openapiPutCountries, putCountries} from "./put/putCountries";
import {openapiPutCustomers, putCustomers} from "./put/putCustomers";

// DELETE ROUTES
import {openapiDeleteCountryByCode, deleteCountryByCode} from "./delete/deleteCountryByCode";
import {openapiDeleteCustomerById, deleteCustomerById} from "./delete/deleteCustomerById";


interface IRouteTuple {
    0: IOpenApiRoute;
    1: IAllRoute;
}

// REGISTER THE ROUTE CONTROLLER HERE
const routes: IRouteTuple[] = [
    [openapiGetCountries, getCountries],
    [openapiGetCountryByCode, getCountryByCode],
    [openapiGetCustomers, getCustomers],
    [openapiGetCustomersById, getCustomersById],

    // POST ROUTES
    [openapiPostCountries, postCountries],
    [openapiPostCustomers, postCustomers],
    [openapiPostPurchaseOrder, postPurchaseOrder],
    [openapiPostSalesOrder, postSalesOrder],

    // PUT ROUTES
    [openapiPutCountries, putCountries],
    [openapiPutCustomers, putCustomers],

    // DELETE ROUTES
    [openapiDeleteCountryByCode, deleteCountryByCode],
    [openapiDeleteCustomerById, deleteCustomerById],
];
const tmpBaseOpenApiRoutes: IOpenApiRoute[] = [];
const tmpBaseRoutes: IAllRoute[] = [];
for (const route of routes) {
    if (!route[1].path.startsWith("/v1/") || !route[0].path.startsWith("/v1/")) {
        // tslint:disable-next-line: no-console
        console.log(route[1]);
        throw new Error("path should start with v1");
    }
    tmpBaseOpenApiRoutes.push(route[0]);
    tmpBaseRoutes.push(route[1]);
}

// seperate the route to openapi and application route, future easier to extend
export const baseOpenApiRoutes: IOpenApiRoute[] = tmpBaseOpenApiRoutes;
export const baseRoutes: IAllRoute[] = tmpBaseRoutes;
