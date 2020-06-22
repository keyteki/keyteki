describe('Sir Marrows', function () {
    describe("Sir Marrows's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre']
                },
                player2: {
                    amber: 1,
                    inPlay: ['sir-marrows']
                }
            });
        });

        it("should capture an amber when opponent's reap", function () {
            this.player1.reap(this.dextre);
            expect(this.sirMarrows.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Sir Marrows's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'archimedes']
                },
                player2: {
                    amber: 3,
                    inPlay: ['sir-marrows', 'sir-marrows']
                }
            });

            this.sirMarrows1 = this.player2.player.creaturesInPlay[1];
            this.sirMarrows2 = this.player2.player.creaturesInPlay[1];
        });

        xit('should capture just one amber, APC should select which Sir Marrows to capture', function () {
            this.player1.reap(this.dextre);
            this.player1.clickCard(this.sirMarrows2);
            this.player1.reap(this.archimedes);
            this.player1.clickCard(this.sirMarrows2);
            expect(this.sirMarrows1.amber).toBe(0);
            expect(this.sirMarrows2.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });
});
