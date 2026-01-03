describe('Cadet Allison', function () {
    describe("Cadet Allison's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['cadet-allison', 'cadet-allison2', 'lamindra', 'murkens'],
                    inPlay: ['umbra']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie']
                }
            });

            this.player1.chains = 36;
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.cadetAllison2, 'discard');
            this.player1.clickCard(this.cadetAllison);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.cadetAllison, 'discard');
            this.player1.clickCard(this.cadetAllison2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.cadetAllison);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.cadetAllison2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should discard random card on play, and change active house', function () {
            this.player1.playCreature(this.cadetAllison);
            expect(this.player1.player.discard.length).toBe(1);
            this.player1.reap(this.umbra);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard random card on reap, and change active house', function () {
            this.player1.playCreature(this.cadetAllison);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.cadetAllison);
            expect(this.player1.player.discard.length).toBe(2);
            this.player1.reap(this.umbra);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
