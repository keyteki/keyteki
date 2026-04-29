describe('Hoaxpitality', function () {
    describe("Hoaxpitality's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['hoaxpitality'],
                    inPlay: ['gemcoat-vendor']
                },
                player2: {
                    inPlay: ['timetraveller']
                }
            });
        });

        it('gives friendly creature the power of the enemy creature', function () {
            this.player1.play(this.hoaxpitality);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.player1).not.toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.timetraveller);
            this.player1.clickCard(this.timetraveller);
            expect(this.gemcoatVendor.power).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.gemcoatVendor.power).toBe(6);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.gemcoatVendor.power).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if no friendly creatures', function () {
            this.player1.moveCard(this.gemcoatVendor, 'discard');
            this.player1.play(this.hoaxpitality);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if no enemy creatures', function () {
            this.player2.moveCard(this.timetraveller, 'discard');
            this.player1.play(this.hoaxpitality);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
