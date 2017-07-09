/* global describe, it, expect */

import DeckSummary from '../../client/DeckSummary.jsx';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('the <DeckSummary /> component', function() {
    var component;

    describe('when initially rendered', function() {
        it('should show the component elements with defaults set', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, name: 'Test Deck', validation: {} } } />);

            var nameHeader = TestUtils.findRenderedDOMComponentWithTag(component, 'h3');

            expect(nameHeader.innerText).toBe('Test Deck');
        });
    });

    describe('when no agenda specified', function() {
        it('should render "none" and no agenda image', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, name: 'Test Deck', validation: {} } } />);

            var agendaImages = TestUtils.scryRenderedDOMComponentsWithClass(component, 'pull-right');
            var cardNames = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-name');

            expect(agendaImages.length).toBe(0);
            expect(cardNames.length).toBe(0);
            expect(component.refs.agenda.innerText).toBe('Agenda: None');
        });
    });

    describe('when agenda specified', function() {
        it('should render the agenda name and image', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, name: 'Test Deck',
                agenda:{ code: 'TestCode', label: 'Test Label' }, validation: {} } } />);

            var agendaImages = TestUtils.scryRenderedDOMComponentsWithClass(component, 'pull-right');
            var cardNames = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-link');

            expect(agendaImages.length).toBe(1);
            expect(agendaImages[0].src.indexOf('/img/cards/TestCode.png')).not.toBe(-1);
            expect(cardNames.length).toBe(1);
            expect(component.refs.agenda.innerText).toBe('Agenda: Test Label');
        });
    });

    describe('card counts', function() {
        describe('when no plot cards', function() {
            it('should render zero plots count', function() {
                component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, plotCards: [], validation: { plotCount: 0 } } } />);

                expect(component.refs.plotCount.innerText).toBe('Plot deck: 0 cards');
            });
        });

        describe('when there are plot cards', function() {
            it('should render the plot count', function() {
                var plotCards = require('./decks/plotValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, plotCards: plotCards, validation: { drawCount: 0, plotCount: 7 } } } />);

                expect(component.refs.plotCount.innerText).toBe('Plot deck: 7 cards');
                expect(component.refs.drawCount.innerText).toBe('Draw deck: 0 cards');
            });
        });

        describe('when no draw cards', function() {
            it('should render zero draw cards', function() {
                component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, drawCards: [], validation: { drawCount: 0 } } } />);

                expect(component.refs.drawCount.innerText).toBe('Draw deck: 0 cards');
            });
        });

        describe('when there are draw cards', function() {
            it('should render the draw count', function() {
                var drawCards = require('./decks/drawValid.json');
                component = TestUtils.renderIntoDocument(<DeckSummary deck={ { faction: { name: 'House Stark', value: 'stark' }, drawCards: drawCards, validation: { drawCount: 61, plotCount: 0 } } } />);

                expect(component.refs.drawCount.innerText).toBe('Draw deck: 61 cards');
                expect(component.refs.plotCount.innerText).toBe('Plot deck: 0 cards');
            });
        });
    });
});
