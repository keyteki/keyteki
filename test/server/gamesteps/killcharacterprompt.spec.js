/*global describe, it, beforeEach, expect,spyOn*/
/* eslint camelcase: 0 */

const KillCharacterPrompt = require('../../../server/game/gamesteps/killcharacterprompt.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('the KillCharacterPrompt', () => {
    var prompt;
    var game;
    var player;
    var otherPlayer;
    var card;
    var events = {
        onKill: () => true,
        onCancel: () => true
    };

    function cardCondition(card) {
        return card.name === 'Killable';
    }

    beforeEach(() => {
        game = new Game('1', 'Test Game');
        player = new Player('1', 'Player 1', true, game);
        player.initialise();
        otherPlayer = new Player('2', 'Player 2', false, game);
        otherPlayer.initialise();
        game.players[player.id] = player;
        game.players[otherPlayer.id] = otherPlayer;
        card = new DrawCard(player, { type_code: 'character', name: 'Killable' });
        prompt = new KillCharacterPrompt(game, player, cardCondition, events);

        player.cardsInPlay.push(card);
        spyOn(player, 'killCharacter');
        spyOn(events, 'onKill');
        spyOn(events, 'onCancel');
    });

    describe('the onCardClicked() function', () => {
        describe('when the player is not the prompted player', () => {
            it('should return false', () => {
                expect(prompt.onCardClicked(otherPlayer, card)).toBe(false);
            });
        });

        describe('when the card is not a character', () => {
            beforeEach(() => {
                spyOn(card, 'getType').and.returnValue('event');
            });

            it('should return false', () => {
                expect(prompt.onCardClicked(player, card)).toBe(false);
            });
        });

        describe('when the card does not match the allowed condition', () => {
            beforeEach(() => {
                card.name = 'Does Not Match';
            });

            it('should return false', () => {
                expect(prompt.onCardClicked(player, card)).toBe(false);
            });
        });

        describe('when the card does match the condition', () => {
            it('should kill the character', () => {
                prompt.onCardClicked(player, card);
                expect(player.killCharacter).toHaveBeenCalledWith(card);
            });

            it('should call the onKill event', () => {
                prompt.onCardClicked(player, card);
                expect(events.onKill).toHaveBeenCalledWith(card);
            });

            it('should complete the prompt', () => {
                prompt.onCardClicked(player, card);
                expect(prompt.isComplete()).toBe(true);
            });
        });
    });

    describe('the onMenuCommand() function', () => {
        describe('when the player is not the prompted player', () => {
            it('should return false', () => {
                expect(prompt.onMenuCommand(otherPlayer)).toBe(false);
            });
        });

        describe('when the player is the prompted player', () => {
            it('should not kill a character', () => {
                prompt.onMenuCommand(player);
                expect(player.killCharacter).not.toHaveBeenCalled();
            });

            it('should call the onCancel event', () => {
                prompt.onMenuCommand(player);
                expect(events.onCancel).toHaveBeenCalledWith();
            });

            it('should complete the prompt', () => {
                prompt.onMenuCommand(player);
                expect(prompt.isComplete()).toBe(true);
            });
        });
    });
});
