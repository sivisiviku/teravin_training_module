import { Country } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { PageableGetParam } from "../lib/appValidator";
import { Pagination } from "../lib/helper/pagination";
import { CurrencyService } from "./currencyService";
import { DataNotFoundError, DuplicateEntryError } from "../error";

export class CountryService {
    private static countryRepository: Repository<Country> = null;
    private static currencyService: CurrencyService = null;

    constructor(di: IDI) {
        if (CountryService.countryRepository === null) {
            CountryService.countryRepository = di.appTypeOrm.getConnection().getRepository(Country);
        }
        
        if (CountryService.currencyService === null) {
            CountryService.currencyService = new CurrencyService(di);
        }

        console.log(CountryService.currencyService);
        console.log(di.currencyService);
    }

    public async findAll(query: PageableGetParam ): Promise<Country[]> {
        return await CountryService.countryRepository.find(Pagination.paginateOption(query, {
            where: {
                deleteFlag: false,
            },
        }));
    }

    public async findByCode(code: string): Promise<Country> {
        return await CountryService.countryRepository
            .findOne({
                where: {code},
            });
    }

    public async findByCodeWithDeleteFlag(code: string): Promise<Country> {
        return await CountryService.countryRepository
            .findOne({
                where: {
                    code,
                    deleteFlag: false,
                },
                relations: ["currency"]
            });
    }

    public async create(data: Country): Promise<Country> {
        const exists = await this.findByCode(data.code);
        if (exists) {
            throw new DuplicateEntryError("Data already exists!");
        }

        const currency = await CountryService.currencyService.findByCodeWithDeleteFlag(data.currencyCode);
        if (!currency) {
            throw new DataNotFoundError(`Currency ${data.currencyCode} does not exist`);
        }

        const country = new Country();
        country.code = data.code;
        country.name = data.name;
        country.currencyCode = data.currencyCode;
        country.dateCreated = new Date();
        country.lastUpdated = new Date();
        country.createdBy = "Admin";
        country.updatedBy = "Admin";
        country.currency = currency;
        try {
            return await CountryService.countryRepository.save(country);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async update(newCountry: Country): Promise<Country> {
        const country = await this.findByCodeWithDeleteFlag(newCountry.code);
        if (country == null) {
            throw new Error(`Country not found ${newCountry.code}`);
        }

        if (newCountry.name !== null || newCountry.name !== undefined) {
            country.name = newCountry.name;
        }

        if (newCountry.currencyCode !== null || newCountry.currencyCode !== undefined) {
            const currency = await CountryService.currencyService.findByCodeWithDeleteFlag(newCountry.currencyCode);
            if (!currency) {
                throw new DataNotFoundError(`Currency ${newCountry.currencyCode} does not exist`);
            }
            country.currency = newCountry.currency;
        }

        country.lastUpdated = new Date();
        country.updatedBy = "Admin";

        return await CountryService.countryRepository.save(country);
    }

    public async delete(code: string): Promise<Country> {
        const country: Country = await this.findByCodeWithDeleteFlag(code);
        if (country == null) {
            throw new DataNotFoundError(`Country not found: ${code}`);
        }
        country.deleteFlag = true;
        await CountryService.countryRepository.save(country);
        return country;
    }
}