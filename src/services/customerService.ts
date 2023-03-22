import { Customer } from "../entity";
import { IDI } from "../interface";
import { Repository } from "typeorm";
import { PageableGetParam } from "../lib/appValidator";
import { Pagination } from "../lib/helper/pagination";
import { DataNotFoundError, DuplicateEntryError } from "../error";

export class CustomerService {
    private static customerRepository: Repository<Customer> = null;

    constructor(di: IDI) {
        if (CustomerService.customerRepository === null) {
            CustomerService.customerRepository = di.appTypeOrm.getConnection().getRepository(Customer);
        }
    }

    public async findAll(query: PageableGetParam): Promise<Customer[]> {
        return await CustomerService.customerRepository.find(Pagination.paginateOption(query));
    }

    public async findById(id: number): Promise<Customer> {
        try {
            return await CustomerService.customerRepository.findOne({
                where: {
                    id,
                },
            });
        } catch (e) {
            console.log(e);
            throw new DataNotFoundError("Invalid code");
        }
    }

    public async create(data: Customer): Promise<Customer> {
        const existing = await this.findById(data.id);
        if (existing) {
            throw new DuplicateEntryError("Data already exists!");
        }

        const customer = new Customer();
        customer.name = data.name;
        try {
            return await CustomerService.customerRepository.save(customer);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    public async update(newCustomer: Customer): Promise<Customer> {
        const customer: Customer = await this.findById(newCustomer.id);
        if (customer == null) {
            throw new DataNotFoundError(`Customer not found: ${newCustomer.id}`);
        }

        if (newCustomer.name !== null || newCustomer.name !== undefined) {
            customer.name =newCustomer.name;
        }

        return await CustomerService.customerRepository.save(customer);
    }

    public async delete(id: number): Promise<Customer> {
        const customer: Customer = await this.findById(id);
        if (customer == null) {
            throw new DataNotFoundError(`Customer not found: ${id}`);
        }

        customer.deleteFlag = "true";
        await CustomerService.customerRepository.save(customer);
        return customer;
    }
}