/**
 * Created by cghislai on 16/01/16.
 */


import {AccountService} from './account';
import {AccountingEntryService} from './accountingEntry';
import {AccountingTransactionService} from './accountingTransaction';
import {ApplicationService} from './application';
import {AttributeDefinitionService} from './attributeDefinition';
import {AttributeValueService} from './attributeValue';
import {AuthService} from './auth';
import {BalanceService} from './balance';
import {CompanyService} from './company';
import {CountryService} from './country';
import {CustomerService} from './customer';
import {EmployeeService} from './employee';
import {ErrorService} from './error';
import {FileUploadService} from './fileUpload';
import {InvoiceService} from './invoice';
import {ItemService} from './item';
import {ItemVariantService} from './itemVariant';
import {ItemVariantSaleService} from './itemVariantSale';
import {MoneyPileService} from './moneyPile';
import {PictureService} from './picture';
import {PosService} from './pos';
import {SaleService} from './sale';

export const SERVICES_PROVIDERS = [
    AccountService,
    AccountingEntryService,
    AccountingTransactionService,
    ApplicationService,
    AttributeDefinitionService,
    AttributeValueService,
    AuthService,
    BalanceService,
    CompanyService,
    CountryService,
    CustomerService,
    EmployeeService,
    ErrorService,
    FileUploadService,
    InvoiceService,
    ItemService,
    ItemVariantService,
    ItemVariantSaleService,
    MoneyPileService,
    PictureService,
    PosService,
    SaleService
];