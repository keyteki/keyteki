describe('Beast of Dark Legend', function () {
    describe("Beast of Dark Legend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['beast-of-dark-legend'],
                    inPlay: ['legendary-keyraken', 'dodger'],
                    discard: ['crushing-tentacle', 'umbra']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.moveCard(this.crushingTentacle, 'purged');
            this.player1.moveCard(this.umbra, 'purged');
        });

        it('plays a Keyraken creature from purged zone and readies a Keyraken creature', function () {
            this.legendaryKeyraken.exhausted = true;
            this.dodger.exhausted = true;
            this.troll.exhausted = true;
            this.player1.play(this.beastOfDarkLegend);
            expect(this.player1).toHavePrompt('Beast of Dark Legend');
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            this.player1.clickCard(this.crushingTentacle);
            this.player1.clickCard(this.legendaryKeyraken);
            this.player1.clickPrompt('Right');
            expect(this.crushingTentacle.location).toBe('play area');
            expect(this.player1).toHavePrompt('Beast of Dark Legend');
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            this.player1.clickCard(this.crushingTentacle);
            expect(this.crushingTentacle.exhausted).toBe(false);
            expect(this.legendaryKeyraken.exhausted).toBe(true);
            expect(this.dodger.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
