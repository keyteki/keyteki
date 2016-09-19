/* global describe, it, expect, beforeEach, spyOn */
/* eslint camelcase: 0 */

import AddDeck from '../../client/AddDeck.jsx';
import Deck from '../../client/Deck.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';
import Typeahead from 'react-bootstrap-typeahead';
import stubComponent from './test-setup.js';

function loadCards(filename, component) {
    var cards = require(filename);

    cards.forEach(function(card) {
        component.addCard(card.card, card.count);
    });
}

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
    stubComponent(Deck);

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
        });
    });
});
