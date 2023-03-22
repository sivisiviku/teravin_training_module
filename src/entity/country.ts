import {
    Entity,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Currency } from "./currency";
import { Maintenable } from "./maintenable";

@Entity({
    name: "mnt_country",
})
export class Country extends Maintenable {
    @ManyToOne(() => Currency, currency => currency.code)
    @JoinColumn({name: "currency_code"})
    public currency: Currency;

    // DTOs
    public currencyCode?: string;
}