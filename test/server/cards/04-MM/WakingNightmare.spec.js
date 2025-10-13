describe('waking-nightmare', function () {
    describe("Waking Nightmare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['waking-nightmare'],
                    inPlay: ['sinder', 'bot-bookton', 'ember-imp']
                },
                player2: {
                    inPlay: ['shooler', 'dust-imp'],
                    amber: 6
                }
            });
        });

        it('should increase key costs for one turn', function () {
            this.player1.play(this.wakingNightmare);
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.player.amber).toBe(6);

            this.player1.clickPrompt('dis');
            this.player1.endTurn();

            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.player.amber).toBe(0);
        });

        it('should increase key costs by 1 for each Dis creature', function () {
            this.player1.play(this.wakingNightmare);
            this.player1.fightWith(this.emberImp, this.dustImp);
            expect(this.player2.player.amber).toBe(8);
            this.player1.endTurn();

            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('dis');
            // shooler and sinder make key cost 8
            expect(this.player2.player.amber).toBe(0);
        });

        it('should change value dynamically', function () {
            this.player1.play(this.wakingNightmare);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(10);
            expect(this.player2.player.getCurrentKeyCost()).toBe(10);
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.dustImp, this.emberImp);
            expect(this.player1.player.getCurrentKeyCost()).toBe(8);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: ['waking-nightmare'],
                    inPlay: ['tachyon-manifold', 'ember-imp']
                },
                player2: {
                    amber: 7,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.wakingNightmare);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
