describe('HotBunk', function () {
    describe("Hot Bunk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['hot-bunk'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('exhausts a creature, then readies a creature', function () {
            this.troll.exhausted = true;
            this.player1.play(this.hotBunk);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('exhausts an exhausted creature, and does not ready a creature', function () {
            this.troll.exhausted = true;
            this.player1.play(this.hotBunk);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can ready a creature that was just exhausted', function () {
            this.player1.play(this.hotBunk);
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.exhausted).toBe(true);
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hot Bunk's ability with Sariel the Steadfast", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['hot-bunk']
                },
                player2: {
                    inPlay: ['sariel-the-steadfast', 'troll']
                }
            });
            this.troll.exhausted = true;
        });

        it('does not ready a creature when no creature can be exhausted', function () {
            this.player1.play(this.hotBunk);
            this.player1.clickCard(this.sarielTheSteadfast);
            expect(this.sarielTheSteadfast.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
