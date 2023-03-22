import {
    Entity,
    BaseEntity,
    Column,
    PrimaryColumn
} from "typeorm";

@Entity({
    name: "purchase_order_item",
})
export class PurchaseOrderItem extends BaseEntity {
    @PrimaryColumn({name: "id"})
    public id: number;

    @Column({name: "purchase_order_id"})
    public purchase_order_id: number;

    @Column({name: "item_id"})
    public item_id: number;

    @Column({name: "price"})
    public price: number;

    @Column({name: "qty"})
    public qty: number;
}