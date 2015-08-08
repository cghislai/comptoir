/**
 * Created by cghislai on 02/08/15.
 */
import {Pagination} from 'client/utils/pagination';

export  enum TransactionType {
    DEPOSIT,
    WITHDRAWAL
}

export class CashTransaction {
    type: TransactionType;
    amount: number;
}
export class CashState {
    date: Date;
    amount: number;
}
export class TransactionSearch {
    pagination: Pagination;
    fromDateExclusive: Date;
}
export class CashStateSearch {
    pagination: Pagination;
}

export class CashService {
    static instance: CashService = null;
    static getInstance():CashService {
        if (CashService.instance == null) {
            CashService.instance = new CashService();
        }
        return CashService.instance;
    }
    state: CashState;
    cashStates: CashState[];
    cashStateCount: number;
    transactions: CashTransaction[];

    constructor() {
        this.transactions = [];
        this.findLastCashState();
    }

    saveCashState(state: CashState) {
        state.date = new Date();
        this.state = state;
    }

    findLastCashState() {
        this.state = new CashState();
        this.state.date = new Date();
        this.state.amount = 0.2;

    }

    searchTransactions(transactionSearch: TransactionSearch) {
        // TODO
    }

    applyTransactions(fromState: CashState):CashState {
        var newState = new CashState();
        var search = new TransactionSearch();
        search.fromDateExclusive = fromState.date;
        // TODO
        var transactionsTotal = 2;
        newState.amount = fromState.amount + transactionsTotal;
        newState.date = new Date;
        return newState;
    }

    findCashStates(search: CashStateSearch) {
        this.cashStates = [];
        this.cashStates.push(this.state);
        this.cashStateCount = 1;
    }

}