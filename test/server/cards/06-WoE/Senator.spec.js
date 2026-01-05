describe('Senator', function () {
    describe("Senator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'senator',
                    amber: 1,
                    inPlay: ['senator:bad-penny', 'faust-the-great']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll'],
                    hand: ['poltergeist']
                }
            });
            this.senator1 = this.player1.player.creaturesInPlay[0];
        });

        it('should increase key cost when Faust The Great is not in discard', function () {
            expect(this.senator1.isToken()).toBe(true);

            this.player1.useAction(this.senator1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });
    });
    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'saurian',
                    token: 'senator',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'monument-to-faust', 'senator:bad-penny']
                },
                player2: {
                    amber: 7,
                    inPlay: [],
                    hand: []
                }
            });
            this.senator2 = this.player1.player.creaturesInPlay[0];
            this.tachyonManifold.maverick = 'saurian';
            this.tachyonManifold.printedHouse = 'saurian';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            expect(this.senator2.isToken()).toBe(true);
            this.player1.useAction(this.senator2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.endTurn();
            this.player1.clickPrompt('saurian');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
