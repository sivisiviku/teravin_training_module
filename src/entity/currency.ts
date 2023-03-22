import {
    Entity,
} from "typeorm";
import { Maintenable } from "./maintenable";

@Entity({
    name: "mnt_currency",
})
export class Currency extends Maintenable {
}