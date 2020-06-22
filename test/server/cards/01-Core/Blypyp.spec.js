describe('Blypyp', function () {
    describe("Blypyp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp'],
                    hand: ['zorg', 'ether-spider', 'commpod']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not ready creature before reaping', function () {
            this.player1.play(this.zorg);
            expect(this.blypyp.exhausted).toBe(false);
            expect(this.zorg.exhausted).toBe(true);
        });

        it('should ready next creature after reaping', function () {
            this.player1.reap(this.blypyp);
            this.player1.play(this.zorg);
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
        });

        it('should ready just the next creature after reaping', function () {
            this.player1.reap(this.blypyp);
            this.player1.play(this.zorg);
            this.player1.play(this.etherSpider);
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.etherSpider.exhausted).toBe(true);
        });

        it('should ready the next creature after reaping and playing artifact', function () {
            this.player1.reap(this.blypyp);
            this.player1.play(this.commpod);
            this.player1.play(this.zorg);
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.commpod.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
        });

        it('should last only one turn', function () {
            this.player1.reap(this.blypyp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.zorg);
            expect(this.blypyp.exhausted).toBe(false);
            expect(this.zorg.exhausted).toBe(true);
        });
    });

    describe("Blypyp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp', 'tunk'],
                    hand: ['zorg', 'ether-spider', 'commpod']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should ready next creature after you click the prompt when you have another simultaneous ability triggering', function () {
            this.player1.fightWith(this.tunk, this.batdrone);
            this.player1.reap(this.blypyp);
            this.player1.play(this.zorg);
            this.player1.clickPrompt('Blypyp');
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
        });

        it('should ready next creature even if you have a prompt and choose to resolve the other trigger first', function () {
            this.player1.fightWith(this.tunk, this.batdrone);
            this.player1.reap(this.blypyp);
            this.player1.play(this.zorg);
            this.player1.clickCard(this.tunk);
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
        });
    });
});
