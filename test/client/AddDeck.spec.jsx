// /* global describe, it, expect, beforeEach, spyOn */
// /* eslint camelcase: 0 */

// import {InnerAddDeck} from '../../client/AddDeck.jsx';
// import DeckEditor from '../../client/DeckEditor.jsx';
// import DeckSummary from '../../client/DeckSummary.jsx';
// import ReactDOM from 'react-dom';
// import React from 'react';
// import $ from 'jquery';
// import Typeahead from 'react-bootstrap-typeahead';
// import stubComponent from './test-setup.jsx';

// function loadCards(filename, component) {
//     var cards = require(filename);

//     cards.forEach(function(card) {
//         component.addCard(card.card, card.count);
//     });
// }

// describe('the <InnerAddDeck /> component', function() {
//     var node, component;

//     stubComponent(Typeahead);
//     stubComponent(DeckEditor);
//     stubComponent(DeckSummary);

//     beforeEach(function() {
//         node = document.createElement('div');
//         spyOn($, 'ajax').and.callFake(function() {
//             var defer = $.Deferred();

//             defer.resolve({});

//             return defer.promise();
//         });

//         component = ReactDOM.render(<InnerAddDeck />, node);
//     });

//     describe('when initially rendered', function() {
//         it('should show the component elements with defaults set', function() {
//         });
//     });
// });
