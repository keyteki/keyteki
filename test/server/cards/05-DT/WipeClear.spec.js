describe('Wipe Clear', function () {
    describe("Wipe Clear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'tantadlin', 'ancient-bear'],
                    hand: ['access-denied', 'disruption-field']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens', 'troll'],
                    hand: ['wipe-clear']
                }
            });

            this.player1.playUpgrade(this.accessDenied, this.troll);
            this.player1.playUpgrade(this.disruptionField, this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.wipeClear);
        });

        it('should deal 1D to each creatue', function () {
            expect(this.armsmasterMolina.damage).toBe(1);
            expect(this.tantadlin.damage).toBe(1);
            expect(this.ancientBear.damage).toBe(1);
            expect(this.murkens.damage).toBe(1);
            expect(this.troll.damage).toBe(1);
        });

        it('should destroy all upgrades', function () {
            expect(this.accessDenied.location).toBe('discard');
            expect(this.disruptionField.location).toBe('discard');
        });
    });
});
