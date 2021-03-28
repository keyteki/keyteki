describe('Plasma Nozzle', function () {
    describe("Plasma Nozzle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'mother', 'tactical-officer-moon'],
                    hand: ['plasma-nozzle']
                },
                player2: {
                    inPlay: ['nexus', 'sequis', 'abond-the-armorsmith']
                }
            });
        });

        it("should add 'before fight: deal 2 to the target with 2 splash'", function () {
            this.player1.playUpgrade(this.plasmaNozzle, this.lieutenantKhrkhar);
            this.player1.fightWith(this.lieutenantKhrkhar, this.sequis);
            expect(this.nexus.tokens.damage).toBe(1);
            expect(this.abondTheArmorsmith.tokens.damage).toBe(2);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(4);
            expect(this.sequis.location).toBe('discard');
        });
    });
});
