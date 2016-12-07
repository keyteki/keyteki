/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

import GameBoard, { InnerGameBoard } from '../../client/GameBoard.jsx';
import PlayerStats, { InnerPlayerStats } from '../../client/GameComponents/PlayerStats.jsx';
import PlayerRow from '../../client/GameComponents/PlayerRow.jsx';
import Card from '../../client/GameComponents/Card.jsx';
import CardCollection from '../../client/GameComponents/CardCollection.jsx';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import stubComponent from './test-setup.jsx';

var state = { cards: {}, games: { state: {}, currentGame: { players: {} } }, socket: {} };

const store = {
    subscribe: () => { },
    dispatch: () => { },
    getState: () => {
        return state;
    }
};

describe('the <GameBoard /> component', function() {
    var node, component;

    stubComponent(PlayerStats);
    stubComponent(InnerPlayerStats);
    stubComponent(Card);
    stubComponent(CardCollection);
    stubComponent(PlayerRow);

    beforeEach(function() {
        node = document.createElement('div');

        component = ReactDOM.render(<InnerGameBoard />, node);

        state.games.currentGame.players['1'] = { id: 1 };
        state.games.currentGame.players['2'] = { id: 2 };
        state.socket.socket = jasmine.createSpyObj('socket', ['emit']);
        state.socket.socket.id = '1';
        state.games.state = state.games.currentGame;
    });

    describe('when initially rendered', function() {
        var divs = undefined;

        beforeEach(function() {
            divs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        });

        it('should render a waiting div', function() {
            expect(divs[0].innerText).toBe('Waiting for server...');
        });
    });

    describe('when player has cards in play', function() {
        describe('that include locations followed by characters', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00002');
                expect(cards[1].props.card.code).toBe('00001');
            });
        });

        describe('that include characters followed by locations', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '1', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '2', code: '00001', type: 'location', label: 'Test Location' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00002');
                expect(cards[1].props.card.code).toBe('00001');
            });
        });

        describe('that include characters mixed with locations', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '3', code: '00003', type: 'character', label: 'Test Character2' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00002');
                expect(cards[1].props.card.code).toBe('00003');
                expect(cards[2].props.card.code).toBe('00001');                
            });
        });
    });

    describe('when other player has cards in play', function() {
        describe('that include locations followed by characters', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { uuid: '3', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '4', code: '00002', type: 'character', label: 'Test Character' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the top and characters on the bottom', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00001');
                expect(cards[1].props.card.code).toBe('00002');
            });
        });

        describe('that include characters followed by locations', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { uuid: '4', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '3', code: '00001', type: 'location', label: 'Test Location' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the top and characters on the bottom', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00001');
                expect(cards[1].props.card.code).toBe('00002');
            });
        });

        describe('that include characters mixed with locations', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '3', code: '00003', type: 'character', label: 'Test Character2' }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { uuid: '5', code: '00002', type: 'character', label: 'Test Character' },
                    { uuid: '4', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '6', code: '00003', type: 'character', label: 'Test Character2' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the top and characters on the bottom', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00001');
                expect(cards[1].props.card.code).toBe('00003');
                expect(cards[2].props.card.code).toBe('00002');
            });
        });

        describe('when the control is re-rendered', function() {
            beforeEach(function() {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { uuid: '1', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '2', code: '00002', type: 'character', label: 'Test Character' }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { uuid: '3', code: '00001', type: 'location', label: 'Test Location' },
                    { uuid: '4', code: '00002', type: 'character', label: 'Test Character' }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should still render the locations on top and characters on bottom', function() {
                var cards = TestUtils.scryRenderedComponentsWithType(component, Card);

                expect(cards[0].props.card.code).toBe('00001');
                expect(cards[1].props.card.code).toBe('00002');
            });
        });
    });

    xdescribe('card menus', function() {
        describe('when there is no menu and the plot is clicked', function() {
            it('should show the used plot popup', function() {
                state.games.state.players['1'].activePlot = { code: '00001' };
                state.games.state.players['1'].plotDiscard = [];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();

                var usedPlots = component.refs.thisPlayerUsedPlot;

                TestUtils.Simulate.click(usedPlots);
                
                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
                
                var popup = TestUtils.scryRenderedDOMComponentsWithClass(component, 'plot-popup');

                expect(popup.length).toBe(1);
            });
        });

        xdescribe('when there is a menu and the plot is clicked', function() {
            beforeEach(function() {
                state.games.state.players['1'].activePlot = { code: '00001', menu: [{ text: 'Test', command: 'plot', method: 'testMethod', arg: 'test' }] };
                state.games.state.players['1'].plotDiscard = [];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();

                var usedPlots = component.refs.thisPlayerUsedPlot;

                TestUtils.Simulate.click(usedPlots);
                
                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();

                this.popup = TestUtils.scryRenderedDOMComponentsWithClass(component, 'plot-popup');
                this.menu = TestUtils.scryRenderedDOMComponentsWithClass(component, 'menu');
            });

            describe('and then the menu option is clicked', function() {
                it('should send a plot message with the right method and argument', function() {
                    TestUtils.Simulate.click(this.menu[0].children[1]);

                    expect(state.socket.socket.emit).toHaveBeenCalledWith('plot', 'test', 'testMethod');
                });
            });

            it('should not show the plot deck popup', function() {
                expect(this.popup.length).toBe(0);
            });

            it('should show the plot menu', function() {              
                expect(this.menu.length).toBe(1);
                expect(this.menu[0].children[0].innerText).toBe('Show');
                expect(this.menu[0].children[1].innerText).toBe('Test');
            });
        });
    });
});
