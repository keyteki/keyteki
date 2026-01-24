describe('Tormax', function () {
    describe("Tormax's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['tormax', 'tormax2', 'gub']
                },
                player2: {
                    amber: 5,
                    hand: [
                        'troll',
                        'narp',
                        'zorg',
                        'vezyma-thinkdrone',
                        'collector-worm',
                        'ulyq-megamouth'
                    ],
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.tormax2, 'discard');
            this.player1.clickCard(this.tormax);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.tormax, 'discard');
            this.player1.clickCard(this.tormax2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.tormax);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.tormax2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should discard hand and purge 2 opponent cards on play', function () {
            this.player1.playCreature(this.tormax);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(4);
            expect(this.player2.player.purged.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard hand and purge 2 opponent cards on reap', function () {
            this.player1.playCreature(this.tormax);
            this.tormax.ready();
            this.player1.moveCard(this.gub, 'hand');
            this.player1.reap(this.tormax);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.purged.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard hand and purge 2 opponent cards on fight', function () {
            this.player1.playCreature(this.tormax);
            this.tormax.ready();
            this.player1.moveCard(this.gub, 'hand');
            this.player1.fightWith(this.tormax, this.lamindra);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.purged.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
