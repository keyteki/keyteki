/*global describe, it, beforeEach, expect, jasmine*/

const AttachmentPrompt = require('../../../server/game/gamesteps/attachmentprompt.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('the AttachmentPrompt', () => {
    var prompt;
    var game = {};
    var player;
    var otherPlayer;
    var attachment;
    var attachmentTarget;

    beforeEach(() => {
        game = jasmine.createSpyObj('game', ['playerDecked', 'getPlayerByName']);
        player = jasmine.createSpyObj('player1', ['canAttach', 'attach']);
        otherPlayer = jasmine.createSpyObj('player2', ['canAttach', 'attach']);

        attachment = new DrawCard(player, {});
        attachmentTarget = new DrawCard(player, {});
        prompt = new AttachmentPrompt(game, player, attachment);

        player.cardsInPlay = [attachmentTarget];
    });

    describe('the onCardClicked() function', () => {
        describe('when the player is not the prompted player', () => {
            it('should return false', () => {
                expect(prompt.onCardClicked(otherPlayer, attachmentTarget)).toBe(false);
            });
        });

        describe('when the player cannot attach the card', () => {
            beforeEach(() => {
                player.canAttach.and.returnValue(false);
            });

            it('should return false', () => {
                expect(prompt.onCardClicked(otherPlayer, attachmentTarget)).toBe(false);
            });
        });

        describe('when the player can attach the card', () => {
            beforeEach(() => {
                game.getPlayerByName.and.returnValue(player);

                player.canAttach.and.returnValue(true);
            });

            describe('when attaching a setup card', () => {
                beforeEach(() => {
                    player.cardsInPlay.push(attachment);
                    player.phase = 'setup';
                });

                it('should attach the card', () => {
                    prompt.onCardClicked(player, attachmentTarget);
                    expect(player.attach).toHaveBeenCalled();
                });
            });

            describe('when attaching a played card', () => {
                beforeEach(() => {
                    player.hand = [attachment];
                });

                it('should attach the card', () => {
                    prompt.onCardClicked(player, attachmentTarget);
                    expect(player.attach).toHaveBeenCalled();
                });
            });

            describe('when attaching a card from discard', () => {
                beforeEach(() => {
                    player.discardPile = [attachment];
                });

                it('should attach the card', () => {
                    prompt.onCardClicked(player, attachmentTarget);
                    expect(player.attach).toHaveBeenCalled();
                });
            });
        });
    });
});
