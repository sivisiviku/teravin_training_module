import {
    BaseEntity,
    Column,
    PrimaryColumn,
} from "typeorm";

export class Maintenable extends BaseEntity {
    @PrimaryColumn({name: "code", length: 40})
    public code: string;

    @Column({name: "date_created"})
    public dateCreated: Date;

    @Column({name: "created_by"})
    public createdBy: string;

    @Column({name: "last_updated"})
    public lastUpdated: Date;

    @Column({name: "updated_by", nullable: true})
    public updatedBy: string;

    @Column({name: "name"})
    public name: string;

    @Column({name: "delete_flag"})
    public deleteFlag: boolean;
}