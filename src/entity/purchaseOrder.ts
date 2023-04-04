import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseOrderItem } from "./purchaseOrderItem";

@Entity({
    name: "purchase_order",
})
export class PurchaseOrder extends BaseEntity {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @Column({name: "date"})
    public date: string;

    @Column({name: "supplierId"})
    public supplierId: number;

    public items: PurchaseOrderItem[];
}