/**
 * Created by cghislai on 22/08/15.
 */

export class NumberUtils {

    static toFixedDecimals(number: number, decimalsAmount: number) : number{
        if (number == null) {
            return 0;
        }
        var numberString = number.toFixed(decimalsAmount);
        return parseFloat(numberString);
    }

    static toInt(number: number) : number{
        if (number == null) {
            return 0;
        }
        var numberString = number.toFixed(0);
        return parseInt(numberString);
    }
}