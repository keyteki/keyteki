describe('Tutor Bin-Rillo', function () {
    describe("Tutor Bin-Rillo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: [
                        'tutor-bin-rillo',
                        'hire-on',
                        'stealth-mode',
                        'the-old-tinker',
                        'ancient-yurk'
                    ]
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('can discard 3 on play and opponent draws one', function () {
            this.player1.playCreature(this.tutorBinRillo);
            expect(this.player1).toBeAbleToSelect(this.hireOn);
            expect(this.player1).toBeAbleToSelect(this.stealthMode);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.ancientYurk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.hireOn);
            this.player1.clickCard(this.stealthMode);
            this.player1.clickCard(this.ancientYurk);
            this.player1.clickPrompt('Done');
            expect(this.hireOn.location).toBe('discard');
            expect(this.stealthMode.location).toBe('discard');
            expect(this.ancientYurk.location).toBe('discard');
            expect(this.theOldTinker.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can discard 1 on play and opponent draws one', function () {
            this.player1.playCreature(this.tutorBinRillo);
            expect(this.player1).toBeAbleToSelect(this.hireOn);
            expect(this.player1).toBeAbleToSelect(this.stealthMode);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.ancientYurk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.ancientYurk);
            this.player1.clickPrompt('Done');
            expect(this.hireOn.location).toBe('hand');
            expect(this.stealthMode.location).toBe('hand');
            expect(this.ancientYurk.location).toBe('discard');
            expect(this.theOldTinker.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can discard 0 on play and opponent draws one', function () {
            this.player1.playCreature(this.tutorBinRillo);
            expect(this.player1).toBeAbleToSelect(this.hireOn);
            expect(this.player1).toBeAbleToSelect(this.stealthMode);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.ancientYurk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.hireOn.location).toBe('hand');
            expect(this.stealthMode.location).toBe('hand');
            expect(this.ancientYurk.location).toBe('hand');
            expect(this.theOldTinker.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.player2.player.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can draw one for each player scrap', function () {
            this.player1.scrap(this.tutorBinRillo);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.player2.player.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
