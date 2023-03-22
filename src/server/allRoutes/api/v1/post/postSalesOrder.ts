import { IRouterContext } from "koa-router";
import { ResponseFormat } from "partial-responsify";
import { IAllRoute, IDI, IOpenApiRoute } from "../../../../../interface";
import { BodyFormat, ValidatorGetParam, ValidatorHeaderParam } from "../../../../../lib";
import {
    commonHeaderParams,
} from "../../../../../scripts";
import {PageableGetParam} from "../../../../../lib/appValidator";
import { SalesOrder } from "../../../../../entity";

const path = "/v1/sales-order";
const method = "POST";
const get: ValidatorGetParam[] = [];
const body: BodyFormat = {
    required: true,
    type: "object",
    swagger: {
        description: "",
        example: {
            id: "",
            description: "",
        },
    },
    fields: {
        date: {
            type: "string",
            required: true
        },
        customer_id: {
            type: "number",
            required: true
        },
        items: {
            type: "array",
            required: true,
            items: {
                type: "object",
                required: true,
                fields: {
                    item_id: {
                        type: "number",
                        required: true
                    },
                    price: {
                        type: "number",
                        required: true
                    },
                    qty: {
                        type: "number",
                        required: true
                    },
                }
            }
        }
    },
};
const headerParams: ValidatorHeaderParam[] = commonHeaderParams;
const responseFormat: ResponseFormat = {
    items: {
        fields: {
            Code: {
                type: "any",
            },
            Desc: {
                type: "string",
            },
            ID:{
                type: "string",
            },
            LastUpdate: {
                type: "string",
            },
        },
        type: "object",
    },
    type: "array",
};
const successResponseFormat: ResponseFormat = {
    fields: {
        data: responseFormat,
    },
    type: "object",
};
const func = async (ctx: IRouterContext): Promise<void> => {
    const di: IDI = ctx.state.di;

    // Validate query params
    di.validator.processQuery<PageableGetParam>(get, ctx.request.query);

    // Validate body
    const requestBody = di.validator.processBody<SalesOrder>(body, ctx.request.body);

    // If you need to validate the headers, uncomment this
    // const headers = di.validator.processHeader<ICommonHeaderParamsProcessed>(headerParams, ctx.request.headers);

    ctx.status = 200;
    ctx.body = await di.salesOrderService.create(requestBody);
};
export const openapiPostSalesOrder: IOpenApiRoute = {
    get,
    headerParams,
    method,
    path,
    successResponseFormat,
    tags: ["masterdata"],
};
export const postSalesOrder: IAllRoute = {
    func,
    method,
    path,
};
