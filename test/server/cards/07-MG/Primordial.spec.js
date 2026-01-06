describe('Primordial', function () {
    describe("Primordial's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['primordial'],
                    inPlay: [
                        'legendary-keyraken',
                        'legendary-keyraken',
                        'crushing-tentacle',
                        'troll'
                    ],
                    deck: ['shield-tentacle', 'grappling-tentacle', 'lashing-tentacle']
                },
                player2: {
                    inPlay: ['legendary-keyraken']
                }
            });
            this.legendaryKeyraken0 = this.player1.inPlay[0];
            this.legendaryKeyraken1 = this.player1.inPlay[1];
            this.legendaryKeyraken2 = this.player2.inPlay[0];
        });

        it('can only be attached to legendary keyraken', function () {
            this.player1.clickCard(this.primordial);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePrompt('Primordial');
            expect(this.primordial.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken0);
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken1);
            expect(this.player1).not.toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.legendaryKeyraken2);
            this.player1.clickCard(this.legendaryKeyraken1);
            expect(this.primordial.location).toBe('play area');
            expect(this.primordial.parent).toBe(this.legendaryKeyraken1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives legendary keyraken draw 2 cards on reap', function () {
            this.player1.playUpgrade(this.primordial, this.legendaryKeyraken0);
            this.player1.reap(this.legendaryKeyraken0);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
