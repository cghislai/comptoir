/**
 * Created by cghislai on 14/08/15.
 */

export class Price {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    vatExclusive: number;
    vatRate: number;
}

export class PriceRef {
    id: number;
    link: string;
}

export class PriceFactory {
    static fromJSONPriceReviver = (key, value)=>{
        return value;
    }
}