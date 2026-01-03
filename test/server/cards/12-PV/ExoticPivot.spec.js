describe('Exotic Pivot', function () {
    describe("Exotic Pivot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['exotic-pivot', 'batdrone'],
                    discard: ['helper-bot', 'draining-touch'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['flaxia'],
                    hand: ['toad']
                }
            });
        });

        it('should steal 3 amber when top card is not logos', function () {
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.play(this.exoticPivot);
            expect(this.drainingTouch.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
        });

        it('should not steal amber when top card is logos', function () {
            this.player1.moveCard(this.helperBot, 'deck');
            this.player1.play(this.exoticPivot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it('should not steal amber when deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.play(this.exoticPivot);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it('should prevent playing creatures when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.exoticPivot);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            this.player2.clickCard(this.toad);
            expect(this.player2).toHavePrompt('Toad');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.playCreature(this.batdrone);
            this.expectReadyToTakeAction(this.player1);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.toad);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
