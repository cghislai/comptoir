/**
 * Created by cghislai on 14/08/15.
 */
import {BasicCacheHandler} from '../utils/basicClient';

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
    static cacheHandler = new BasicCacheHandler<Price>();
    static fromJSONPriceReviver = (key, value)=>{
        return value;
    }
}