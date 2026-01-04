describe('Monsquito', function () {
    describe("Monsquito's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['monsquito', 'alaka']
                },
                player2: {
                    inPlay: ['flaxia', 'dust-pixie']
                }
            });
        });

        it('heals after fighting', function () {
            this.player1.fightWith(this.monsquito, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.monsquito.tokens.damage).toBe(undefined);
            expect(this.monsquito.location).toBe('play area');
        });

        it('heals all damage after fighting', function () {
            this.monsquito.tokens.damage = 1;
            this.player1.fightWith(this.monsquito, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.monsquito.tokens.damage).toBe(undefined);
            expect(this.monsquito.location).toBe('play area');
        });

        it('does not heal after fighting when it dies', function () {
            this.player1.fightWith(this.monsquito, this.flaxia);
            expect(this.flaxia.location).toBe('play area');
            expect(this.monsquito.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 2 damage to a creature after fighting', function () {
            this.player1.fightWith(this.monsquito, this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.monsquito);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
