describe('Indigo Halyard', function () {
    describe("Indigo Halyard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    inPlay: ['hunting-witch', 'indigo-halyard', 'bosun-creen']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should do nothing if no blue key forged', function () {
            this.player1.reap(this.indigoHalyard);
            expect(this.huntingWitch.hasKeyword('taunt')).toBe(false);
            expect(this.indigoHalyard.hasKeyword('taunt')).toBe(false);
            expect(this.bosunCreen.hasKeyword('taunt')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ready and fight with another creature if own blue key forged', function () {
            this.player1.player.keys = { blue: true, red: false, yellow: false };
            this.player1.reap(this.bosunCreen);
            this.player1.reap(this.indigoHalyard);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).not.toBeAbleToSelect(this.indigoHalyard);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.huntingWitch.hasKeyword('taunt')).toBe(false);
            expect(this.indigoHalyard.hasKeyword('taunt')).toBe(false);
            expect(this.bosunCreen.hasKeyword('taunt')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give neighbors taunt if opponent blue key forged', function () {
            this.player2.player.keys = { blue: true, red: false, yellow: false };
            this.player1.reap(this.bosunCreen); // force effect recalculation
            expect(this.huntingWitch.hasKeyword('taunt')).toBe(true);
            expect(this.indigoHalyard.hasKeyword('taunt')).toBe(false);
            expect(this.bosunCreen.hasKeyword('taunt')).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
