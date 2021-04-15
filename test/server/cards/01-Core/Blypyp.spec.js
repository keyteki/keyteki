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
                    hand: ['zorg', 'ether-spider', 'commpod', 'skybooster-squadron']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should ready the next creature played when it has another simultaneous ability', function () {
            this.player1.fightWith(this.tunk, this.batdrone);
            this.player1.reap(this.blypyp);
            this.player1.play(this.zorg);
            expect(this.blypyp.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
        });

        it('should not ready twice if creature is returned to hand', function () {
            this.player1.reap(this.blypyp);
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.reap(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.location).toBe('hand');
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(true);
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

    describe("Two Blypyp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp', 'blypyp'],
                    hand: ['ether-spider', 'skybooster-squadron']
                },
                player2: {
                    hand: ['troll']
                }
            });

            this.blypyp1 = this.player1.inPlay[0];
            this.blypyp2 = this.player1.inPlay[1];
        });

        it('should ready a single creature if reaps sequentially', function () {
            this.player1.reap(this.blypyp1);
            this.player1.reap(this.blypyp2);
            this.player1.play(this.skyboosterSquadron);
            this.player1.clickPrompt('Blypyp');
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(true);
        });

        it('should ready two creatures if reaps after the first creature', function () {
            this.player1.reap(this.blypyp1);
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.reap(this.blypyp2);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(false);
        });
    });

    describe("Blypyp and Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp'],
                    hand: ['ether-spider', 'skybooster-squadron', 'soft-landing']
                },
                player2: {
                    hand: ['troll']
                }
            });

            this.blypyp1 = this.player1.inPlay[0];
            this.blypyp2 = this.player1.inPlay[1];
        });

        it('should ready a single creature if reaps and played sequentially', function () {
            this.player1.reap(this.blypyp1);
            this.player1.play(this.softLanding);
            this.player1.play(this.skyboosterSquadron);
            this.player1.clickPrompt('Blypyp');
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(true);
        });

        it('should ready two creatures if played after the first creature', function () {
            this.player1.reap(this.blypyp1);
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.play(this.softLanding);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(false);
        });
    });
});
