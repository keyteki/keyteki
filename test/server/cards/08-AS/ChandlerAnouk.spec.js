describe('Chandler Anouk', function () {
    describe("Chandler Anouk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['chandler-anouk', 'bosun-creen'],
                    inPlay: ['hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'gub', 'pelf']
                }
            });
        });

        it('should give flank creatures +2 armor and taunt', function () {
            this.player1.playCreature(this.chandlerAnouk);
            expect(this.huntingWitch.armor).toBe(2);
            expect(this.huntingWitch.hasKeyword('taunt')).toBe(true);
            expect(this.chandlerAnouk.armor).toBe(2);
            expect(this.chandlerAnouk.hasKeyword('taunt')).toBe(true);
            expect(this.troll.armor).toBe(0);
            expect(this.troll.hasKeyword('taunt')).toBe(false);
            expect(this.gub.armor).toBe(0);
            expect(this.gub.hasKeyword('taunt')).toBe(true);
            expect(this.pelf.armor).toBe(0);
            expect(this.pelf.hasKeyword('taunt')).toBe(false);

            this.player1.playCreature(this.bosunCreen);
            expect(this.chandlerAnouk.armor).toBe(0);
            expect(this.chandlerAnouk.hasKeyword('taunt')).toBe(false);
            expect(this.bosunCreen.armor).toBe(2);
            expect(this.bosunCreen.hasKeyword('taunt')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
