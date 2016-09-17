/* global describe, it, expect, beforeEach, spyOn */

import AddDeck from '../../client/AddDeck.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';
import Typeahead from 'react-bootstrap-typeahead';
import stubComponent from './test-setup.js';

describe('the </AddDeck /> component', function() {
    var node, component;
    var router = {
        push: function() { },
        replace: function() { },
        go: function() { },
        goBack: function() { },
        goForward: function() { },
        setRouteLeaveHook: function() { },
        isActive: function() { }
    };

    stubComponent(Typeahead);

    beforeEach(function() {
        node = document.createElement('div');
        spyOn($, 'ajax').and.callFake(function() {
            var defer = $.Deferred();

            defer.resolve({});

            return defer.promise();
        });

        component = ReactDOM.render(<AddDeck router={ router }/>, node).getWrappedInstance();
    });

    describe('when initially rendered', function() {
        it('should show the component elements with defaults set', function() {
            expect(component.state.deckname).toBe('New Deck');
        });
    });
});
