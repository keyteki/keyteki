describe('Red-Hot Armor', function () {
    describe("Red-Hot Armor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['firespitter', 'ember-imp', 'succubus'],
                    hand: ['red-hot-armor']
                },
                player2: {
                    inPlay: ['sequis', 'commander-remiel', 'raiding-knight', 'champion-anaphiel'], // armors: 4/2, 3/0, 4/2, 6/1
                    hand: ['shadow-self', 'abond-the-armorsmith']
                }
            });
        });

        it('should deal the correct amount of damage to each creature', function () {
            this.player1.fightWith(this.emberImp, this.sequis);
            expect(this.sequis.armorUsed).toBe(2);
            expect(this.sequis.damage).toBe(0);

            this.player1.play(this.redHotArmor);
            expect(this.firespitter.damage).toBe(0);
            expect(this.succubus.damage).toBe(0);

            expect(this.sequis.damage).toBe(0);
            expect(this.commanderRemiel.damage).toBe(0);
            expect(this.raidingKnight.damage).toBe(2);
            expect(this.raidingKnight.armorUsed).toBe(2);
            expect(this.championAnaphiel.damage).toBe(1);
            expect(this.championAnaphiel.armorUsed).toBe(1);
        });

        it('should deal damage only to Shadow self', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.shadowSelf);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.redHotArmor);

            expect(this.emberImp.damage).toBe(0);
            expect(this.firespitter.damage).toBe(0);
            expect(this.succubus.damage).toBe(0);

            expect(this.sequis.damage).toBe(2);
            expect(this.sequis.armorUsed).toBe(2);
            expect(this.commanderRemiel.damage).toBe(0);
            expect(this.raidingKnight.damage).toBe(2);
            expect(this.raidingKnight.armorUsed).toBe(2);
            expect(this.championAnaphiel.damage).toBe(0);
            expect(this.championAnaphiel.armorUsed).toBe(1);
            expect(this.shadowSelf.damage).toBe(1);
        });

        it('should deal extra damage due to abond', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.shadowSelf);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playCreature(this.abondTheArmorsmith);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.redHotArmor);

            expect(this.emberImp.damage).toBe(0);
            expect(this.firespitter.damage).toBe(0);
            expect(this.succubus.damage).toBe(0);

            expect(this.sequis.damage).toBe(3);
            expect(this.sequis.armorUsed).toBe(3);
            expect(this.commanderRemiel.damage).toBe(1);
            expect(this.commanderRemiel.armorUsed).toBe(1);
            expect(this.raidingKnight.damage).toBe(3);
            expect(this.raidingKnight.armorUsed).toBe(3);
            expect(this.championAnaphiel.damage).toBe(0);
            expect(this.championAnaphiel.armorUsed).toBe(2);
            expect(this.shadowSelf.damage).toBe(3);
            expect(this.shadowSelf.armorUsed).toBe(1);
            expect(this.abondTheArmorsmith.damage).toBe(0);
        });
    });
});
