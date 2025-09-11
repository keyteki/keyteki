describe('Security Detail', function () {
    describe("Security Detail's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['security-detail'],
                    inPlay: ['cpo-zytar', 'the-old-tinker', 'medic-ingram', 'gemcoat-vendor']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('captures onto a creature and each neighbor', function () {
            this.player1.play(this.securityDetail);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.theOldTinker.amber).toBe(1);
            expect(this.medicIngram.amber).toBe(1);
            expect(this.gemcoatVendor.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can choose if only one amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.securityDetail);
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.gemcoatVendor);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.theOldTinker.amber).toBe(0);
            expect(this.medicIngram.amber).toBe(0);
            expect(this.gemcoatVendor.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can choose if only two amber', function () {
            this.player2.amber = 2;
            this.player1.play(this.securityDetail);
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.gemcoatVendor);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.theOldTinker.amber).toBe(0);
            expect(this.medicIngram.amber).toBe(1);
            expect(this.gemcoatVendor.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
