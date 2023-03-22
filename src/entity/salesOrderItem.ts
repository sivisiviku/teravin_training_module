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

    @Column({name: "sales_order_id"})
    public sales_order_id: number;

    @Column({name: "item_id"})
    public item_id: number;

    @Column({name: "price"})
    public price: number;

    @Column({name: "qty"})
    public qty: number;
}