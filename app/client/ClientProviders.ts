/**
 * Created by cghislai on 15/01/16.
 */


import {AccountClient} from './account';
import {AccountingEntryClient} from './accountingEntry';
import {AccountingTransactionClient} from './accountingTransaction';
import {AttributeDefinitionClient} from './attributeDefinition';
import {AttributeValueClient} from './attributeValue';
import {AuthClient} from './auth';
import {BalanceClient} from './balance';
import {CompanyClient} from './company';
import {CountryClient} from './country';
import {CustomerClient} from './customer';
import {EmployeeClient} from './employee';
import {InvoiceClient} from './invoice';
import {ItemClient} from './item';
import {ItemVariantClient} from './itemVariant';
import {ItemVariantSaleClient} from './itemVariantSale';
import {MoneyPileClient} from './moneyPile';
import {PictureClient} from './picture';
import {PosClient} from './pos';
import {SaleClient} from './sale';

export const CLIENT_PROVIDERS = [
    AccountClient,
    AccountingEntryClient,
    AccountingTransactionClient,
    AttributeDefinitionClient,
    AttributeValueClient,
    AuthClient,
    BalanceClient,
    CompanyClient,
    CountryClient,
    CustomerClient,
    EmployeeClient,
    InvoiceClient,
    ItemClient,
    ItemVariantClient,
    ItemVariantSaleClient,
    MoneyPileClient,
    PictureClient,
    PosClient,
    SaleClient
];