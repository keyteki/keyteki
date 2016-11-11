/* global describe, it, expect, beforeEach */
/* eslint camelcase: 0 */

import GameBoard, { InnerGameBoard } from '../../client/GameBoard.jsx';
import PlayerStats, { InnerPlayerStats } from '../../client/GameComponents/PlayerStats.jsx';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import stubComponent from './test-setup.jsx';

var state = { games: { state: {}, currentGame: { players: {} } }, socket: {} };

const store = {
    subscribe: () => { },
    dispatch: () => { },
    getState: () => {
        return state;
    }
};

describe('the <GameBoard /> component', function () {
    var node, component;

    stubComponent(PlayerStats);
    stubComponent(InnerPlayerStats);

    beforeEach(function () {
        node = document.createElement('div');

        component = ReactDOM.render(<InnerGameBoard />, node);

        state.games.currentGame.players['1'] = { id: 1};
        state.games.currentGame.players['2'] = { id: 2};
        state.socket.socket = {};
        state.socket.socket.id = '1';
        state.games.state = state.games.currentGame;
    });

    describe('when initially rendered', function () {
        var divs = undefined;

        beforeEach(function () {
            divs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        });

        it('should render a waiting div', function () {
            expect(divs[0].innerText).toBe('Waiting for server...');
        });
    });

    describe('when player has cards in play', function () {
        describe('that include locations followed by characters', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
            });
        });

        describe('that include characters followed by locations', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
            });
        });

        describe('that include characters mixed with locations', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0003', type_code: 'character', label: 'Test Character2' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
                expect(rows[0].children[1].children[0].children[0].children[0].children[0].src.indexOf('0003')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
            });
        });
    });

    describe('when other player has cards in play', function () {
        describe('that include locations followed by characters', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the top and characters on the bottom', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
            });
        });

        describe('that include characters followed by locations', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
            });
        });

        describe('that include characters mixed with locations', function () {
            beforeEach(function () {
                state.games.currentGame.players['1'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0003', type_code: 'character', label: 'Test Character2' } }
                ];
                state.games.currentGame.players['2'].cardsInPlay = [
                    { card: { code: '0002', type_code: 'character', label: 'Test Character' } },
                    { card: { code: '0001', type_code: 'location', label: 'Test Location' } },
                    { card: { code: '0003', type_code: 'character', label: 'Test Character2' } }
                ];

                component = ReactDOM.render(<Provider store={store}><GameBoard /></Provider>, node);
                component = TestUtils.findRenderedComponentWithType(component, GameBoard).getWrappedInstance();
            });

            it('should render locations on the bottom and characters on the top', function () {
                var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'card-row');

                // <div class='card-row'><div class='card-wrapper'><div class='card-frame'><div class='card'><div><img></img></div></div></div></div></div>
                expect(rows[0].children[0].children[0].children[0].children[0].children[0].src.indexOf('0001')).not.toBe(-1);
                expect(rows[1].children[1].children[0].children[0].children[0].children[0].src.indexOf('0002')).not.toBe(-1);
                expect(rows[1].children[0].children[0].children[0].children[0].children[0].src.indexOf('0003')).not.toBe(-1);
            });
        });
    });
});
