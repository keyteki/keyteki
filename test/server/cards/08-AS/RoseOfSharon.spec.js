describe('Rose of Sharon', function () {
    describe("Rose of Sharon's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['flaxia', 'rose-of-sharon', 'hunting-witch']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow dealing damage equal to the power of a neighbor to an enemy creature', function () {
            this.player1.useAction(this.roseOfSharon);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.roseOfSharon);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.roseOfSharon);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(4);
            expect(this.flaxia.damage).toBe(0);
            expect(this.roseOfSharon.damage).toBe(0);
            expect(this.flaxia.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if red key is forged', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.useAction(this.roseOfSharon);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.roseOfSharon);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.roseOfSharon);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(6);
            expect(this.huntingWitch.damage).toBe(0);
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
