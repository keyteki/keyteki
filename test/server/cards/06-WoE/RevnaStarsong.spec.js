describe('Revna Starsong', function () {
    describe("Revna Starsong's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    token: 'berserker',
                    inPlay: ['berserker:toad', 'berserker:clone-home', 'pelf'],
                    hand: ['revna-starsong', 'ancient-battleground']
                },
                player2: {
                    inPlay: ['umbra', 'kelifi-dragon', 'hunting-witch']
                }
            });

            this.berserker2 = this.player1.player.creaturesInPlay[1];
        });

        it('should remove Berserker fight abilitu', function () {
            this.player1.fightWith(this.berserker, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.berserker.location).toBe('discard');
            this.player1.playCreature(this.revnaStarsong);
            this.player1.fightWith(this.berserker2, this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.berserker2.location).toBe('play area');
            expect(this.berserker2.damage).toBe(2);
        });

        it('should also remove other granted fight abilities', function () {
            this.player1.play(this.ancientBattleground);
            this.player1.playCreature(this.revnaStarsong);
            this.player1.fightWith(this.berserker, this.umbra);
            expect(this.berserker.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.pelf, this.kelifiDragon);
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1.amber).toBe(2);
        });
    });
});
