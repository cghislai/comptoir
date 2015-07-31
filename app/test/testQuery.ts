/**
 * Created by cghislai on 31/07/15.
 */

import {Component, View, NgIf, ViewQuery, Query, QueryList} from 'angular2/angular2';


@Component({selector: 'child'})
@View({
    template: '<div>Im the child</div>'
})
export class ChildComp {

}

@Component({selector: 'parent'})
@View({
    template: '<div>Im the parent<table><tr><td><child></child></td></tr></table></div><div>Ive found {{ query.length }} childs</div>',
    directives: [ChildComp]
})
export class ParentComp {
    query: QueryList<ChildComp>;
    constructor(@Query(ChildComp, {descendants: true}) query: QueryList<ChildComp>) {
        this.query = query;
    }
}
