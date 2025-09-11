describe('Iron Heidy', function () {
    describe("Iron Heidy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['hire-on'],
                    inPlay: ['medic-ingram', 'iron-heidy', 'cpo-zytar', 'gemcoat-vendor'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    hand: ['hypnobeam', 'clone-home'],
                    inPlay: ['batdrone'],
                    discard: new Array(8).fill('poke') // not yet haunted
                }
            });
        });

        it('does nothing when not haunted', function () {
            expect(this.medicIngram.armor).toBe(0);
            expect(this.ironHeidy.armor).toBe(0);
            expect(this.cpoZytar.armor).toBe(1);
            expect(this.gemcoatVendor.armor).toBe(0);
        });

        it('grants armor when haunted', function () {
            this.player1.play(this.hireOn);
            expect(this.medicIngram.armor).toBe(2);
            expect(this.ironHeidy.armor).toBe(2);
            expect(this.cpoZytar.armor).toBe(3);
            expect(this.gemcoatVendor.armor).toBe(0);
        });

        it('works for opponent as well', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.ironHeidy);
            this.player2.clickPrompt('Right');
            expect(this.medicIngram.armor).toBe(0);
            expect(this.ironHeidy.armor).toBe(0);
            this.player2.play(this.cloneHome);
            expect(this.batdrone.armor).toBe(2);
            expect(this.ironHeidy.armor).toBe(2);
        });
    });
});
