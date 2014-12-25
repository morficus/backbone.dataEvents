/* jshint jasmine: true */
/* global  Backbone  */
describe('Backbone.dataEvents', function () {

    var Model, Collection;

    beforeEach(function () {
        Model = Backbone.Model.extend({
            defaults: {
                name: '',
                age: null
            }
        });
        Collection = Backbone.Collection.extend({
            model: Model
        });
    });

    describe('modelEvents', function () {
        var View;
        beforeEach(function () {
            View = Backbone.View.extend({
                foo: function () {
                    return 'foo';
                },

                bar: function () {
                    return 'bar';
                }
            });
        });

        it('should throw an exception if a "modelEvents" attribute is defined but no model is present', function () {
            var View = Backbone.View.extend({
                modelEvents: {
                    'change': function(){ return true; }
                }
            });

            expect( function () {new View();}).toThrow();
        });

        it('can have named-functions as a callback', function () {
            View = View.extend({
                modelEvents: {
                    'change': 'foo'
                }
            });
            var view = new View({model: new Model()});

            spyOn(view, 'foo');
            view.delegateEvents();
            view.model.set('name', 'Johnny');

            expect(view.foo.calls.count()).toEqual(1);
        });

        it('can have an array of named-functions as a callback', function () {
            View = View.extend({
                modelEvents: {
                    'change': ['foo', 'bar']
                }
            });
            var view = new View({model: new Model()});

            spyOn(view, 'foo');
            spyOn(view, 'bar');
            view.delegateEvents();
            view.model.set('name', 'Johnny');

            expect(view.foo.calls.count()).toEqual(1);
            expect(view.bar.calls.count()).toEqual(1);
        });

        it('can have an antonymous function as a callback', function () {
            View = View.extend({
                annonValue: false,
                modelEvents: {
                    'change': function () { this.annonValue = true; return 'annon'; }
                }
            });
            var view = new View({model: new Model()});

            expect(view.annonValue).toBe(false);
            view.model.set('name', 'Johnny');
            expect(view.annonValue).toBe(true);
        });

        it('can respond to custom events', function () {
            View = View.extend({
                modelEvents: {
                    'myAwesomeEvent': 'foo'
                }
            });
            var view = new View({model: new Model()});


            spyOn(view, 'foo');
            view.delegateEvents();
            view.model.trigger('myAwesomeEvent');

            expect(view.foo.calls.count()).toEqual(1);
        });

        it('will stop listening to events after .undelegateEvents is called', function () {
            View = View.extend({
                modelEvents: {
                    'change': 'foo'
                }
            });
            var view = new View({model: new Model()});

            spyOn(view, 'foo');
            view.delegateEvents();
            view.model.set('name', 'Johnny');

            expect(view.foo.calls.count()).toEqual(1);

            view.undelegateEvents();
            view.model.set('name', 'Mr. Cash');
            expect(view.foo.calls.count()).toEqual(1);
        });
    });

    describe('collectionEvents', function () {
        var View;
        beforeEach(function () {
            View = Backbone.View.extend({
                foo: function () {
                    return 'foo';
                },

                bar: function () {
                    return 'bar';
                }
            });
        });

        it('should throw an exception if a "collectionEvents" attribute is defined but no collection is present', function () {
            var View = Backbone.View.extend({
                collectionEvents: {
                    'change': function(){ return true; }
                }
            });

            expect( function () {new View();}).toThrow();
        });

        it('can have named-functions as a callback', function () {
            View = View.extend({
                collectionEvents: {
                    'add': 'foo'
                }
            });
            var view = new View({collection: new Collection()});

            spyOn(view, 'foo');
            view.delegateEvents();
            view.collection.add({'name': 'Johnny'});

            expect(view.foo.calls.count()).toEqual(1);
        });

        it('can have an array of named-functions as a callback', function () {
            View = View.extend({
                collectionEvents: {
                    'add': ['foo', 'bar']
                }
            });
            var view = new View({collection: new Collection()});

            spyOn(view, 'foo');
            spyOn(view, 'bar');
            view.delegateEvents();
            view.collection.add({'name': 'Jhonny'});

            expect(view.foo.calls.count()).toEqual(1);
            expect(view.bar.calls.count()).toEqual(1);
        });

        it('can have an antonymous function as a callback', function () {
            View = View.extend({
                annonValue: false,
                collectionEvents: {
                    'add': function () { this.annonValue = true; return 'annon'; }
                }
            });
            var view = new View({collection: new Collection()});

            expect(view.annonValue).toBe(false);
            view.collection.add({'name': 'Johnny'});
            expect(view.annonValue).toBe(true);
        });

        it('can respond to custom events', function () {
            View = View.extend({
                collectionEvents: {
                    'myAwesomeEvent': 'foo'
                }
            });
            var view = new View({collection: new Collection()});


            spyOn(view, 'foo');
            view.delegateEvents();
            view.collection.trigger('myAwesomeEvent');

            expect(view.foo.calls.count()).toEqual(1);
        });

        it('can respond to events bubbled up from models inside of it', function () {
            View = View.extend({
                collectionEvents: {
                    'add': 'foo',
                    'change': 'bar'
                }
            });
            var view = new View({collection: new Collection()}),
                model = new Model({name: 'Johnny'});

            spyOn(view, 'foo');
            spyOn(view, 'bar');
            view.delegateEvents();

            view.collection.add(model);
            expect(view.foo.calls.count()).toEqual(1);

            model.set('name', 'Mr. Cash');
            expect(view.bar.calls.count()).toEqual(1);
        });

        it('will stop listening to events after .undelegateEvents is called', function () {
            View = View.extend({
                collectionEvents: {
                    'add': 'foo',
                    'change': 'bar'
                }
            });
            var view = new View({collection: new Collection()}),
                model = new Model({name: 'Johnny'});

            spyOn(view, 'foo');
            spyOn(view, 'bar');
            view.delegateEvents();

            view.collection.add(model);
            expect(view.foo.calls.count()).toEqual(1);

            model.set('name', 'Mr. Cash');
            expect(view.bar.calls.count()).toEqual(1);

            view.undelegateEvents();
            view.collection.add({name: 'Billy'});
            expect(view.foo.calls.count()).toEqual(1);

            model.set('name', 'John');
            expect(view.bar.calls.count()).toEqual(1);
        });
    });
});
