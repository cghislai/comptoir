/**
 * Created by cghislai on 14/01/16.
 */

import {WithId} from './withId';

export interface WSResourceCache<T extends WithId> {
    putInCache(entity:T);
    getFromCache(id:number): T;
    contains(id:number): boolean;
    clearId(id:number);
    clear();
}

export class WSResourceMemoryCache<T extends WithId> implements WSResourceCache<T> {
    private cache:{[id:number] : T};

    constructor() {
        this.cache = {};
    }

    putInCache(entity:T) {
        if (entity.id == null) {
            throw 'Invalid entity: id is null';
        }
        this.cache[entity.id] = entity;
    }

    getFromCache(id:number):T {
        if (!this.contains(id)) {
            throw 'Invalid id: Not present in cache';
        }
        return this.cache[id];
    }

    contains(id:number) {
        return this.cache[id] != null;
    }

    clearId(id:number) {
        delete this.cache[id];
    }

    clear() {
        this.cache = {};
    }
}