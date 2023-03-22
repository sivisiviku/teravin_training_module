import { IRouterContext } from "koa-router";
import { ResponseFormat } from "partial-responsify";
import { IAllRoute, IDI, IOpenApiRoute } from "../../../../../interface";
import { ValidatorGetParam, ValidatorHeaderParam, ValidatorPathParam } from "../../../../../lib";
import {
    commonHeaderParams,
} from "../../../../../scripts";

const path = "/v1/countries/:code";
const method = "GET";
const get: ValidatorGetParam[] = [];
const headerParams: ValidatorHeaderParam[] = commonHeaderParams;
const pathParams: ValidatorPathParam[] = [{
    name: "code",
    required: true,
    swagger: {
        description: "",
        example: "",
    },
    type: "string",
}];
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
    di.validator.processQuery(get, ctx.request.query);

    // Get path
    const params = di.validator.processPath<{ code: string }>(pathParams, ctx.params);

    // If you need to validate the headers, uncomment this
    // const headers = di.validator.processHeader<ICommonHeaderParamsProcessed>(headerParams, ctx.request.headers);

    ctx.status = 200;
    ctx.body = await di.countryService.findByCodeWithDeleteFlag(params.code);
};
export const openapiGetCountryByCode: IOpenApiRoute = {
    get,
    headerParams,
    method,
    path,
    successResponseFormat,
    tags: ["masterdata"],
};
export const getCountryByCode: IAllRoute = {
    func,
    method,
    path,
};
