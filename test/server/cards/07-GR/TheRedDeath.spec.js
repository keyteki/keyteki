describe('The Red Death', function () {
    describe("The Red Death's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['clone-home', 'mars-first'],
                    inPlay: ['the-red-death'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'groke']
                }
            });
            this.theRedDeath.exhaust();
            this.player1.chains = 36;
        });

        it('does not ready at end of turn if not haunted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.theRedDeath.exhausted).toBe(true);
        });

        it('does not ready from card effects if not haunted', function () {
            this.player1.play(this.marsFirst);
            this.player1.clickCard(this.theRedDeath);
            expect(this.theRedDeath.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('ready at end of turn if haunted', function () {
            this.player1.play(this.cloneHome);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.theRedDeath.exhausted).toBe(false);
        });

        it('gains 1 amber and draws 1 card on fight', function () {
            this.player1.play(this.cloneHome);
            this.player1.play(this.marsFirst);
            this.player1.clickCard(this.theRedDeath);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
