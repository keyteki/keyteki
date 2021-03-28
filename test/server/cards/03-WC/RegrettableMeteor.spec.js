describe('Regrettable Meteor', function () {
    describe("Regrettable Meteor's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'flaxia', 'philophosaurus', 'orator-hissaro', 'paraguardian'],
                    hand: ['regrettable-meteor']
                },
                player2: {
                    inPlay: ['lamindra', 'terrordactyl', 'zorg']
                }
            });
        });

        it('should destroy all Dinosaurs and creatures with power 6 or higher', function () {
            this.player1.play(this.regrettableMeteor);

            expect(this.troll.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.philophosaurus.location).toBe('discard');
            expect(this.oratorHissaro.location).toBe('discard');
            expect(this.paraguardian.location).toBe('discard');

            expect(this.lamindra.location).toBe('play area');
            expect(this.terrordactyl.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');
        });
    });
});
