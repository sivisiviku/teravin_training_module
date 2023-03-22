import {
    Entity,
    BaseEntity,
    Column,
    PrimaryColumn,
} from "typeorm";

@Entity({
    name: "customer",
})
export class Customer extends BaseEntity {
    @PrimaryColumn({name: "id"})
    public id: number;

    @Column({name: "name"})
    public name: string;

    @Column({name: "delete_flag"})
    public deleteFlag: string;
}