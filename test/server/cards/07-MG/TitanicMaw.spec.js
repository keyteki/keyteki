describe('Titanic Maw', function () {
    describe("Titanic Maw's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['titanic-maw'],
                    inPlay: [
                        'legendary-keyraken',
                        'legendary-keyraken',
                        'crushing-tentacle',
                        'troll'
                    ]
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
            this.player1.clickCard(this.titanicMaw);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePrompt('Titanic Maw');
            expect(this.titanicMaw.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken0);
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken1);
            expect(this.player1).not.toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.legendaryKeyraken2);
            this.player1.clickCard(this.legendaryKeyraken1);
            expect(this.titanicMaw.location).toBe('play area');
            expect(this.titanicMaw.parent).toBe(this.legendaryKeyraken1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives legendary keyraken skirmish and splash-attack 3', function () {
            this.player1.playUpgrade(this.titanicMaw, this.legendaryKeyraken0);
            expect(this.legendaryKeyraken0.hasKeyword('skirmish')).toBe(true);
            expect(this.legendaryKeyraken0.getKeywordValue('splash-attack')).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
