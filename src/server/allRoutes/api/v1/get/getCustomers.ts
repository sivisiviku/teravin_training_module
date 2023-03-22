import { IRouterContext } from "koa-router";
import { ResponseFormat } from "partial-responsify";
import { IAllRoute, IDI, IOpenApiRoute } from "../../../../../interface";
import { ValidatorGetParam, ValidatorHeaderParam } from "../../../../../lib";
import {
    commonHeaderParams,
} from "../../../../../scripts";
import {PageableGetParam, pageableGetParamValidator} from "../../../../../lib/appValidator";
import { Workbook } from "exceljs";

const path = "/v1/customers";
const method = "GET";
const get: ValidatorGetParam[] = [
    ...pageableGetParamValidator,
    {
        minLength: 1,
        name: "fields",
        required: false,
        swagger: {
            description: "Fields needed from response",
            example: "Code,Desc,ID,LastUpdate",
        },
        type: "string",
        default: "Code,Desc,ID,LastUpdate",
    }
];
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
    const query = di.validator.processQuery<PageableGetParam>(get, ctx.request.query);

    // If you need to validate the headers, uncomment this
    // const headers = di.validator.processHeader<ICommonHeaderParamsProcessed>(headerParams, ctx.request.headers);

    ctx.status = 200;
    ctx.body = await di.customerService.findAll(query);

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("customers");
    sheet.columns = [
        { header: "ID", key: "id", width: 25 },
        { header: "Name", key: "name", width: 50 },
        { header: "Delete Flag", key: "deleteFlag", width: 25 },
    ];
    await ctx.body.map((value) => {
        sheet.addRow({
            id: value.id,
            name: value.name,
            deleteFlag: value.deleteFlag
        });
    });

    // const filePath = "/home/richard/SourceCode/Teravin/module/files/customer.xlsx";
    // workbook.xlsx.writeFile(filePath);
    
    ctx.set("ContentType", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    ctx.set("Content-Disposition", "attachment;filename=" + "customers.xlsx");
    await workbook.xlsx.write(ctx.res);
};
export const openapiGetCustomers: IOpenApiRoute = {
    get,
    headerParams,
    method,
    path,
    successResponseFormat,
    tags: ["masterdata"],
};
export const getCustomers: IAllRoute = {
    func,
    method,
    path,
};
