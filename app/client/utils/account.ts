/**
 * Created by cghislai on 13/08/15.
 */
import {AccountType} from "client/domain/account";
import {LocaleTexts} from 'client/utils/lang';

export class NamedAccountType {
    static OTHER = new NamedAccountType(AccountType.OTHER, {
        'fr': 'Autre'
    });
    static PAYMENT = new NamedAccountType(AccountType.PAYMENT, {
        'fr': 'Paiement'
    });
    static VAT = new NamedAccountType(AccountType.VAT, {
        'fr': 'TVA'
    });
    static ALL_TYPES = [NamedAccountType.OTHER, NamedAccountType.PAYMENT, NamedAccountType.VAT];

    static getNamedForType(accountType:AccountType):NamedAccountType {
        for (var namedType of  NamedAccountType.ALL_TYPES) {
            if (namedType.type == accountType) {
                return namedType;
            }
        }
        return null;
    }

    type:AccountType;
    label:LocaleTexts;

    constructor(accountType:AccountType, label:LocaleTexts) {
        this.type = accountType;
        this.label = label;
    }
}