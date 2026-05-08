describe('Monster Zero', function () {
    describe("Monster Zero's deploy keyword", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'urchin']
                },
                player2: {}
            });
        });

        it('can deploy when played by clicking the bottom half', function () {
            this.player1.clickCard(this.monsterZero);
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
        });

        it('can deploy when played by clicking the top half', function () {
            this.player1.clickCard(this.monsterZero2);
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
        });
    });

    describe("Monster Zero's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'urchin']
                },
                player2: {}
            });
            this.player1.play(this.monsterZero, true, true);
            this.player1.clickCard(this.urchin);
        });

        it("changes the house of Monster Zero's neighbors to Mars", function () {
            expect(this.troll.hasHouse('mars')).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(false);
            expect(this.urchin.hasHouse('mars')).toBe(true);
            expect(this.urchin.hasHouse('shadows')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Monster Zero's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'snufflegator']
                },
                player2: {}
            });
        });

        it("adds power counters equal to the most powerful friendly creature's power", function () {
            this.player1.play(this.monsterZero);
            expect(this.monsterZero.power).toBe(9);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
