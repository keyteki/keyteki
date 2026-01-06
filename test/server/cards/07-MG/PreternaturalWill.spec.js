describe('Preternatural Will', function () {
    describe("Preternatural Will's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['preternatural-will'],
                    inPlay: [
                        'legendary-keyraken',
                        'legendary-keyraken',
                        'crushing-tentacle',
                        'ancient-bear'
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

        it('fully heals each friendly keyraken creature', function () {
            this.legendaryKeyraken0.tokens.damage = 1;
            this.legendaryKeyraken1.tokens.damage = 2;
            this.crushingTentacle.tokens.damage = 3;
            this.ancientBear.tokens.damage = 4;
            this.legendaryKeyraken2.tokens.damage = 5;
            this.player1.play(this.preternaturalWill);
            expect(this.legendaryKeyraken0.tokens.damage).toBe(undefined);
            expect(this.legendaryKeyraken1.tokens.damage).toBe(undefined);
            expect(this.crushingTentacle.tokens.damage).toBe(undefined);
            expect(this.ancientBear.tokens.damage).toBe(4);
            expect(this.legendaryKeyraken2.tokens.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
