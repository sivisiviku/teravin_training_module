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

    @Column({name: "purchaseOrderId"})
    public purchaseOrderId: number;

    @Column({name: "itemId"})
    public itemId: number;

    @Column({name: "price"})
    public price: number;

    @Column({name: "qty"})
    public qty: number;
}