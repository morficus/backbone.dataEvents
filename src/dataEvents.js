(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('backbone'), require('underscore'));
    } else {
        factory(window.Backbone, window._);
    }
})(function (Backbone, _) {

    var ViewPrototype = Backbone.View.prototype;

    ViewPrototype.delegateEvents = _.wrap(ViewPrototype.delegateEvents, function(original, events) {

        // delegate normal events as usual
        original.call(this, events);

        var that = this,
            bindEvents;

        // private helper function for handling event binding
        bindEvents = function (eventHash, entity) {
            _.each( eventHash, function (handler, event) {
                if (_.isString(handler)) {
                    that.listenTo(that[entity], event, that[handler]);
                } else if (_.isFunction(handler)) {
                    that.listenTo(that[entity], event, handler);
                } else if (_.isArray(handler)) {
                    //TODO: would be neat to make this a recursive function, that way the callback-array is more flexible
                    _.each(handler, function (callback) {
                        that.listenTo(that[entity], event, that[callback]);
                    });
                }
            });
        };

        // automatically bind to model and collection events
        if (this.modelEvents) {
            if (this.hasOwnProperty('collection')) {
                bindEvents(_.result(this, 'modelEvents'), 'model');
            } else {
                console.warn('No model defined: You defined a "modelEvents" hash but your view does not have a "model" attribute.');
            }
        }

        if (this.collectionEvents) {
            if (this.hasOwnProperty('collection')) {
                bindEvents(_.result(this, 'collectionEvents'), 'collection');
            } else {
                console.error('No collection defined: You defined a "collectionEvents" hash but your view does not have a "collection" attribute.');
            }
        }


        return this;
    });

    // TODO: need to check if this is even needed, Backbone might already be cleaning up these events on its own
    ViewPrototype.undelegateEvents = _.wrap(ViewPrototype.delegateEvents, function(original, events) {
        original.call(this, events);

        this.stopListening(this.model);
    });
});
