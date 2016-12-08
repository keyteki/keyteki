/* global describe, it, expect */

import DeckSummary from '../../client/DeckSummary.jsx';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('the <DeckSummary /> component', function() {
    var component;

    describe('when initially rendered', function() {
        it('should show the component elements with defaults set', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } name={ 'Test Deck' } />);

            var nameHeader = TestUtils.findRenderedDOMComponentWithTag(component, 'h3');

            expect(nameHeader.innerText).toBe('Test Deck');
            expect(component.state.status).toBe('Invalid');
        });
    });

    describe('when no agenda specified', function() {
        it('should render "none" and no agenda image', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } name={ 'Test Deck' } />);

            var agendaImages = TestUtils.scryRenderedDOMComponentsWithClass(component, 'pull-right');
            var cardNames = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-name');

            expect(agendaImages.length).toBe(0);
            expect(cardNames.length).toBe(0);
            expect(component.refs.agenda.innerText).toBe('Agenda: None');
        });
    });

    describe('when agenda specified', function() {
        it('should render the agenda name and image', function() {
            component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } name={ 'Test Deck' }
                agenda={ { code: 'TestCode', label: 'Test Label' } } />);

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
                component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } plotCards={[]} />);

                expect(component.refs.plotCount.innerText).toBe('Plot deck: 0 cards');
            });
        });

        describe('when there are plot cards', function() {
            it('should render the plot count', function() {
                var plotCards = require('./decks/plotValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } plotCards={ plotCards } />);

                expect(component.refs.plotCount.innerText).toBe('Plot deck: 7 cards');
                expect(component.refs.drawCount.innerText).toBe('Draw deck: 0 cards');
            });
        });

        describe('when no draw cards', function() {
            it('should render zero draw cards', function() {
                component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } drawCards={[]} />);

                expect(component.refs.drawCount.innerText).toBe('Draw deck: 0 cards');
            });
        });

        describe('when there are draw cards', function() {
            it('should render the draw count', function() {
                var drawCards = require('./decks/drawValid.json');
                component = TestUtils.renderIntoDocument(<DeckSummary faction={ { name: 'House Stark', value: 'stark' } } drawCards={ drawCards } />);

                expect(component.refs.drawCount.innerText).toBe('Draw deck: 61 cards');
                expect(component.refs.plotCount.innerText).toBe('Plot deck: 0 cards');
            });
        });
    });

    describe('validateDeck', function() {
        describe('when not enough plot cards', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotTooFew.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when more than one of a plot and enough plot cards', function() {
            it('should not show plot deck error', function() {
                var plot = require('./decks/plotValidDuplicate.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).not.toBe('Too few plot cards');
            });
        });

        describe('when not enough draw cards', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawTooFew.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when too many of a card', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawTooMany.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when too many plots', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotTooMany.json');
                var draw = require('./decks/drawValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when kings of summer agenda and winter plots', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotWinter.json');
                var draw = require('./decks/drawValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } }
                    agenda={{ 'type_code': 'agenda', 'type_name': 'Agenda', 'code': '04037', 'name': 'Kings of Summer', 'deck_limit': 1, 'traits': 'Summer.', 'label': 'Kings of Summer' }} />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when kings of winter agenda and summer plots', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } }
                    agenda={{ 'type_code': 'agenda', 'type_name': 'Agenda', 'code': '04038', 'name': 'Kings of Winter', 'deck_limit': 1, 'traits': 'Winter.', 'label': 'Kings of Winter' }} />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when cards outside of faction and no banner', function() {
            it('should show deck error', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawBanner.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when cards outside of faction, valid banner but loyal cards included', function() {
            it('should show invalid deck', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawInvalidBanner.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Greyjoy', value: 'greyjoy' } }
                    agenda={{ code: '01201', label: 'Banner of the Sun' }} />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when cards outside of faction, valid banner but too few banner cards', function() {
            it('should show invalid deck', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawTooFewBanner.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Greyjoy', value: 'greyjoy' } }
                    agenda={{ code: '01201', label: 'Banner of the Sun' }} />);

                expect(component.state.status).toBe('Invalid');
            });
        });

        describe('when cards outside of faction and valid banner', function() {
            it('should show valid deck', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawBanner.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Greyjoy', value: 'greyjoy' } }
                    agenda={{ code: '01201', label: 'Banner of the Sun' }} />);

                expect(component.state.status).toBe('Valid');
            });
        });

        describe('when enough plot and draw cards', function() {
            it('should show valid deck', function() {
                var plot = require('./decks/plotValid.json');
                var draw = require('./decks/drawValid.json');

                component = TestUtils.renderIntoDocument(<DeckSummary plotCards={ plot } drawCards={ draw } faction={ { name: 'House Stark', value: 'stark' } } />);

                expect(component.state.status).toBe('Valid');
            });
        });
    });
});
