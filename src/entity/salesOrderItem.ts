import {
    Entity,
    BaseEntity,
    Column,
    PrimaryColumn
} from "typeorm";

@Entity({
    name: "sales_order_item",
})
export class SalesOrderItem extends BaseEntity {
    @PrimaryColumn({name: "id"})
    public id: number;

    @Column({name: "salesOrderId"})
    public salesOrderId: number;

    @Column({name: "itemId"})
    public itemId: number;

    @Column({name: "price"})
    public price: number;

    @Column({name: "qty"})
    public qty: number;
}