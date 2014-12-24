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

        var that = this;
        _.each( this.modelEvents, function (handler, event) {
            if (_.isString(handler)) {
                that.listenTo(that.model, event, that[handler]);
            } else if (_.isFunction(handler)) {
                that.listenTo(that.model, event, handler);
            } else if (_.isArray(handler)) {
                //TODO: would be neat to make this a recursive function, that way the callback-array is more flexible
                _.each(handler, function (callback) {
                    that.listenTo(that.model, event, that[callback]);
                });
            }

        });

        return this;
    });

    ViewPrototype.undelegateEvents = _.wrap(ViewPrototype.delegateEvents, function(original, events) {
        original.call(this, events);
        // TODO: needs implementation;;;
    });
});
