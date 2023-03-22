import {
    Entity,
    BaseEntity,
    Column,
    PrimaryColumn
} from "typeorm";

@Entity({
    name: "item",
})
export class Item extends BaseEntity {
    @PrimaryColumn({name: "id"})
    public id: number;

    @Column({name: "date"})
    public date: Date;

    @Column({name: "price"})
    public price: number;

    @Column({name: "qty"})
    public qty: number;
}