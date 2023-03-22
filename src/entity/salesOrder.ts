import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";
import { SalesOrderItem } from "./salesOrderItem";

@Entity({
    name: "sales_order",
})
export class SalesOrder extends BaseEntity {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @Column({name: "date"})
    public date: string;

    @Column({name: "customer_id"})
    public customer_id: number;

    public items: SalesOrderItem[];
}