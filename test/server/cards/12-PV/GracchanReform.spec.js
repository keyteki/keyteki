describe('Gracchan Reform', function () {
    describe("Gracchan Reform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['gracchan-reform'],
                    discard: ['urchin', 'hunting-witch', 'nerve-blast']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    discard: ['dust-pixie']
                }
            });
        });

        it('should play the top card of opponent deck', function () {
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player1.play(this.gracchanReform);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie.controller).toBe(this.player1.player);
            expect(this.player1.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive top 2 cards of opponent deck on fate', function () {
            this.player1.activateProphecy(this.overreach, this.gracchanReform);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.moveCard(this.urchin, 'deck');
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player2.moveCard(this.nerveBlast, 'deck');
            this.player2.reap(this.krump);
            expect(this.nerveBlast.location).toBe('archives');
            expect(this.huntingWitch.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.gracchanReform.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
