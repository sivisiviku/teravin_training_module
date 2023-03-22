import { IRouterContext } from "koa-router";
import { ResponseFormat } from "partial-responsify";
import { IAllRoute, IDI, IOpenApiRoute } from "../../../../../interface";
import { BodyFormat, ValidatorGetParam, ValidatorHeaderParam } from "../../../../../lib";
import {
    commonHeaderParams,
} from "../../../../../scripts";
import {PageableGetParam} from "../../../../../lib/appValidator";
import { Country } from "../../../../../entity";

const path = "/v1/countries";
const method = "POST";
const get: ValidatorGetParam[] = [];
const body: BodyFormat = {
    required: true,
    type: "object",
    swagger: {
        description: "",
        example: {
            code: "",
            description: "",
        },
    },
    fields: {
        code: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            required: true
        },
        name: {
            type: "string",
            minLength: 1,
            required: true
        },
        currencyCode: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            required: true
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
    const requestBody = di.validator.processBody<Country>(body, ctx.request.body);

    // If you need to validate the headers, uncomment this
    // const headers = di.validator.processHeader<ICommonHeaderParamsProcessed>(headerParams, ctx.request.headers);

    ctx.status = 200;
    ctx.body = await di.countryService.create(requestBody);
};
export const openapiPostCountries: IOpenApiRoute = {
    get,
    headerParams,
    method,
    path,
    successResponseFormat,
    tags: ["masterdata"],
};
export const postCountries: IAllRoute = {
    func,
    method,
    path,
};
