import { Currency } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { PageableGetParam } from "../lib/appValidator";
import { Pagination } from "../lib/helper/pagination";
import { DataNotFoundError, DuplicateEntryError } from "../error";

export class CurrencyService {
    private static currencyRepository: Repository<Currency> = null;

    constructor(di: IDI) {
        if (CurrencyService.currencyRepository === null) {
            CurrencyService.currencyRepository = di.appTypeOrm.getConnection().getRepository(Currency);
        }
    }

    public async findAll(query: PageableGetParam): Promise<Currency[]> {
        return await CurrencyService.currencyRepository.find(Pagination.paginateOption(query, {
            where: {
                deleteFlag: false,
            },
        }));
    }

    public async findByCodeWithDeleteFlag(code: string): Promise<Currency> {
        try {
            return await CurrencyService.currencyRepository.findOne({
                where: {
                    code,
                    deleteFlag: false,
                },
            });
        } catch (e) {
            console.log(e);
            throw new DataNotFoundError("Invalid code");
        }
    }

    public async findByCode(code: string): Promise<Currency> {
        try {
            return await CurrencyService.currencyRepository
                .findOne({
                    where: {
                        code,
                    },
                });
        } catch (e) {
            console.log(e);
            throw new DataNotFoundError("Invalid code");
        }
    }

    public async create(data: Currency): Promise<Currency> {
        const existing = await this.findByCode(data.code);
        if (existing) {
            throw new DuplicateEntryError("Data already exists!");
        }

        const currency = new Currency();
        currency.createdBy = "Admin";
        currency.updatedBy = "Admin";
        currency.dateCreated = new Date();
        currency.lastUpdated = new Date();
        currency.code = data.code;
        currency.name = data.name;
        try {
            return await CurrencyService.currencyRepository.save(currency);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async update(newCurrency: Currency): Promise<Currency> {
        const currency: Currency = await this.findByCodeWithDeleteFlag(newCurrency.code);
        if (currency == null) {
            throw new DataNotFoundError(`Currency not found: ${newCurrency.code}`);
        }

        if (newCurrency.name !== null || newCurrency.name !== undefined) {
            currency.name =newCurrency.name;
        }
        if (newCurrency.code !== null || newCurrency.code !== undefined) {
            currency.code = newCurrency.code;
        }

        currency.lastUpdated = new Date();
        currency.updatedBy = "Admin";

        return await CurrencyService.currencyRepository.save(currency);
    }

    public async delete(code: string): Promise<Currency> {
        const currency: Currency = await this.findByCode(code);
        if (currency == null) {
            throw new DataNotFoundError(`Currency not found: ${code}`);
        }

        currency.deleteFlag = true;
        await CurrencyService.currencyRepository.save(currency);
        return currency;
    }
}