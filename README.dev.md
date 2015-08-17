# Developper information

## Design:

* everything is under app/

* __client/__: The REST client.
** domain/*
** utils/*: some wrapper classes
** *: REST resource-based client.

* __services/__: The services used by the app to interact with the REST service
A single instance for the app. I think the are recrreated when refreshing the page.
They are injected in the components. To inject in other services, @Inject from 'angular2/angular2' must be used;

* __components/__: The view components
* __directives/__: The view directives. These classes are instanciated and mapped to a DOM element, just
as components, but hey don't have templates.
* __res/__;
* __ styles/__: SASS format, compiled at build time
* __typings/__: type inforamtion for typescript compiler
* __app.ts/__: The entry point
** Defines all the routes (@RouteConfig)
 *** map a path to a component and an alias
** Bootstrap all the services
 *** When a service is added, in order for to inject it it must be added to the bootstrap statement.

## To create a new screen

* create a folder under 'components'
* create the (usually) 3 files
** mycomponent.ts
** mycomponent.scss: The styles
** mycomopnents.html: The template

* Typical mycomponent.ts:
```
import {Component, View,                      // Required base
        NgFor, NgIf,                          // To allow *ng-if and *ng-for statements in template
        formDirectives                        // To use angular-enhanced forms
        } from 'angular2/angular2';
import {Router,                               // If router must be injected
        RouterLink                            // To use [router-link] in templates
        } from 'angular2/router'
// local imports

Component({
    selector: "myComponent",                    // an unique selector name.
    properties: ['myPropField1: prop1',         // properties bound to HTML attribute ('<myComponent prop1=val1 my-camel-cased-property=val2>')
                 'myCamelCasedProperty'],        //  here MyComonent.myPropField1 will hold value val1, and MyComponent.myCamelCasedProperty will hold val2
    events: ['event1', 'event2']                // events that this component may trigger
})

@View({
    templateUrl: './components/mycomponent/comp.html', // template file
    styleUrls: ['./components/mycomponent/comp.css'],  // style file (css extension)
    directives: [NgFor, NgIf, MyElementComponent, formDirectives] // Directives and components to inject in the template
})

export class MyComponent {
  myPropField1: string;
  myCamelCasedProperty: boolean;
  event1: EventEmitter;
  event2: EventEmitter;

  myValue: Value;
  value2: Value2;
  canEditValue2: boolean = true;

  myMessage: LocaleTexts;    // Localized texts are wrapped in LocaleTexts class.
                             // myMessage['fr'] hold the french value.
                             // The application locale is available in applicationService.language.locale

  myService1: Service1;
  language: string = 'fr';

  // Services must be injected in the constructor (might be bound through properties as well)
  // Router migh be as well
  // attributs might be as well using @Attribute('attributeName') myAttribute: string
  // Querying other elements might be done here as well using @Query, @ViewQuery, @Ancestor (subject to change in angular2)
  contructor(myService1: Service1, myService2: Service2, router: Router) {
    this.myService1 = myService1;
    this.myValue = new Value();
  }
}
```
* A template examlpe for this comopnent:
```
<div class="myComponent">
    <div  [hidden]="myComponent.myValue == null">  <!-- Bind the 'hidden' attribute  -->
      <!-- This will be evaluated at render time, but only hidden by browser, so this will trigger a NPE when myValue is null -->
      {{ myValue.value }}
    </div>
    <div *ng-if="myValue != null">
        <!-- This is safe to prevent evaluation of child elements -->
        My value is : {{ myValue.numberValue | number:'.2-2' } }} <!-- render the expression 'myValue.numberValue' using a pipe to format number (minimum &nd maximum 2 digits after the comma) -->
    </div>

    <!-- for each loop -->
    <div *ng-for="#element of myValue.elementList">
        <!-- injecting other component. They must appear in the View directives in the component class -->
        <myElementComponent [element]="element"></myElementComponent>
    </div>

    <!-- two-way binding -->
    <!-- the class editable will be added to the component -->
    <!-- the 'value' property of the 'myValue2Selector' component will be updated when value2 changes, and vice-versa -->
    <div [class.editable]="canEditValue2">
        <myValue2Selector [(value)]="value2"></myvalue2Selector>
        <a (click)="value2 = new Value2('test')">Renew value</a>
        <span (^click)="canEditValue=false"> <!-- To observe events from childeren, the ^ prefix is required -->
          <a>stop editing</a>
        </span>
    </div>

    <!-- internationalization -->
    <span> {{ myMessage[language] }} </span>
</div>

```

* Concerning the SASS style file:
```
import '../../../../_main'   /* Import the main style file */

.myComponent {  /* style definition may have childeren to match the DOM tree */

  div:not(.editable) {
    pointer-action: none;
  }
  a {
    @extend .lightBlueLink;
  }
}
```


Voilà the basics.

The paginator is a simple reusable components with various properties.
Some lists are as well (items/itemList and sale/saleList).

edit views (items/edit) use forms and map HTML fields value to a model.

In order to listen to attributes change, I used a workaround using setters. I declare the property as
```
properties: ['myPropery: property']
```
I use the field property (not myProperty):
```
class ...{
  property: string;
}
```
Then i setup the setter:
```
set myProperty(value: string) {
  this.property = value;
  this.onPropertyChanged();
}
```
This could also be used for value transformation I guess.


I will also mention the router link, mostyl used in navMenu:
```
<a [router-link]="['/saleEditSale', {id: sale.id}]">edit sale {{ sale.id }}</a>
```
This will create a link to the route with the 'saleEditSale' alias, passing parameter sale.id as id.
The route is defined as {path: '/sale/edit/id', component: '...', alias: 'saleEditSale'}


Validation is (will) be possible using angular2, they will probably still work on that. I haven't implemented any yet.
Just using HTML5 input validation for now (required, min, max, step, ...)