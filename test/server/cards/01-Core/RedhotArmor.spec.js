describe('Red-Hot Armor', function() {
    integration(function() {
        describe('Red-Hot Armor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['firespitter', 'ember-imp', 'succubus'],
                        hand: ['red-hot-armor']
                    },
                    player2: {
                        inPlay: ['sequis', 'commander-remiel', 'raiding-knight', 'champion-anaphiel']
                    }
                });
                this.player1.fightWith(this.emberImp, this.sequis);
                this.player1.play(this.redHotArmor);
            });

            it('should deal the correct amount of damage to each creature', function() {
                expect(this.sequis.hasToken('damage')).toBe(false);
                expect(this.firespitter.hasToken('damage')).toBe(false);
                expect(this.succubus.hasToken('damage')).toBe(false);
                expect(this.commanderRemiel.hasToken('damage')).toBe(false);
                expect(this.raidingKnight.tokens.damage).toBe(2);
                expect(this.championAnaphiel.tokens.damage).toBe(1);
                expect(this.raidingKnight.armor).toBe(2);
                expect(this.raidingKnight.armorUsed).toBe(2);
            });
        });
    });
});
