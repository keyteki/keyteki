describe('Seraphic Armor', function () {
    describe("Seraphic Armor's play ability and armor bonus", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['seraphic-armor'],
                    inPlay: ['krump', 'troll', 'bumpsy']
                },
                player2: {}
            });
        });

        it('attaches to a friendly creature, fully heals it, and grants +1 armor without healing or arming neighbors', function () {
            this.troll.damage = 5;
            this.krump.damage = 2;
            this.bumpsy.damage = 2;
            this.player1.playUpgrade(this.seraphicArmor, this.troll);
            expect(this.troll.damage).toBe(0);
            expect(this.troll.armor).toBe(1);
            expect(this.krump.damage).toBe(2);
            expect(this.krump.armor).toBe(0);
            expect(this.bumpsy.damage).toBe(2);
            expect(this.bumpsy.armor).toBe(0);
            expect(this.seraphicArmor.parent).toBe(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
