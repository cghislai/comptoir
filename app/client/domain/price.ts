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

    static cache: {[id: number] : Price} = {};
    static putInCache(price: Price) {
        var priceId = price.id;
        if (priceId == null) {
            throw 'no id';
        }
        PriceFactory.cache[priceId] = price;
    }

    static getFromCache(id: number) {
        return PriceFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete PriceFactory.cache[id];
    }

    static clearCache() {
        PriceFactory.cache = {};
    }
}