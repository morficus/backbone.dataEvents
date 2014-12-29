# Backbone.dataEvents
[![Build Status](https://travis-ci.org/morficus/backbone.dataEvents.svg?branch=master)](https://travis-ci.org/morficus/backbone.dataEvents)
[![Code Climate](https://codeclimate.com/github/morficus/backbone.dataEvents/badges/gpa.svg)](https://codeclimate.com/github/morficus/backbone.dataEvents)

Inspired by Backbone.Marionette's [modelEvents and collectionEvents](http://marionettejs.com/docs/marionette.view.html#viewmodelevents-and-viewcollectionevents)
> Similar to the events hash, views can specify a configuration hash for collections and models.


## Benefits
* Better code organization via declarative event bindings for models and collections
* Lightweight, only 1kb (vs Marionette which is 40kb minified)

## Usage

`bower install backbone.dataevents --save`

### Getting it into your project
The Backbone.dataEvents plugin follows the [UMD pattern](https://github.com/umdjs/umd) for JavaScript modules, that means that it can be loaded in a browser via a traditional `<script>` tag or a module loader (like [require.js](http://requirejs.org/)) or even server-side with Node.js  


If you are using a module loader, just include it as any other module.  
If you choose to load it via script tags, just make sure to do so after you include Backbone.  

```html
 <script type="text/javascript" src="underscore.js"></script>
 <script type="text/javascript" src="backbone.js"></script>
 <script type="text/javascript" src="backbone.global.js"></script>
 ```

### In your code

Once it is loaded, all of your views will have access to 2 new properties (just extend from `Backbone.View` as usual): `modelEvents` and `collectionEvents`.  

These properties will define the event binding between your view and the events triggered from the model or collection (custom and built-in events). As mentioned at the top of this document, these are both hashes that follow a  format very similar to the regular Backbone.View `events` hash. Here is an example:

When binding to multiple model or collection events, you typically write something like this:
```javascript
var MyView = Backbone.View.extend({
    events: {
        'click .button.delete': 'destroy',
        'click .button.add': 'openAddDialog',
        'click .button.edit': 'openEditDialog'
    },
    
    initialize: function () {
        this.listenTo(this.collection, 'add', this.insertNewRow);
        this.listenTo(this.collection, 'add', this.updateCounter);
        this.listenTo(this.collection, 'remove', this.deleteRow);
        this.listenTo(this.collection, 'remove', this.updateCounter);
        this.listenTo(this.collection, 'change', this.render);
    },
    
    render: function () {
        ...
    }
});
```

This plugin allows you to write those bindings like this:
```javascript
var MyView = Backbone.View.extend({
    events: {
        'click .button.delete': 'destroy',
        'click .button.add': 'openAddDialog',
        'click .button.edit': 'openEditDialog'
    },
    
    collectionEvents: {
        'add': ['insertNewRow', 'updateCounter'],
        'remove': ['deleteRow', 'updateCounter'],
        'change': 'render'
    },
    
    initialize: function () {
        ...
    },
    
    render: function () {
        ...
    }
});
```

Pretty neat, huh?


Both the `modelEvents` and `collectionEvents` support 3 forms to callbacks:

1- named functions:  
    `'change': 'someFunctionName'`  
2- anonymous functions:  
    `'change': function() { /* cool stuff here */ }`  
3- an array of named functions (most useful when you want to call more than 1 function when an event is triggered):   
    `'change': ['someFunctionName', 'someOtherFunction`]`  



## Additional reading
For more examples, take a look at the [examples directory](https://github.com/morficus/backbone.dataEvents/tree/master/examples)


If you found this plugin useful, then you may also like [Backbone.global](https://github.com/DarrylD/Backbone.global) which does the same thing but for custom global events. I suggest you check it out as well.
