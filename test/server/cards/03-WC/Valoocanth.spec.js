describe('Valoocanth', function () {
    describe("Valoocanth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valoocanth'],
                    hand: ['troll', 'autocannon']
                },
                player2: {
                    hand: ['panpaca-anga', 'flaxia', 'bigtwig']
                }
            });
        });

        it('after reap, should not exhaust enemy creature if none is in play', function () {
            this.player1.reap(this.valoocanth);
            expect(this.player1).not.toHavePrompt('Valoocanth');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Valoocanth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valoocanth'],
                    hand: ['troll', 'autocannon']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('after fight, should not exhaust enemy creature if none is in play', function () {
            this.player1.fightWith(this.valoocanth, this.flaxia);
            expect(this.player1).not.toHavePrompt('Valoocanth');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Valoocanth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valoocanth'],
                    hand: ['troll', 'autocannon']
                },
                player2: {
                    inPlay: ['redlock', 'lamindra', 'tantadlin', 'flaxia']
                }
            });
        });

        it('after reap, should exhaust enemy creature and its neighbors', function () {
            this.player1.reap(this.valoocanth);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.redlock.exhausted).toBe(true);
            expect(this.tantadlin.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
        });

        it('after fight, should exhaust enemy creature and its neighbors', function () {
            this.player1.fightWith(this.valoocanth, this.flaxia);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.redlock.exhausted).toBe(true);
            expect(this.tantadlin.exhausted).toBe(true);
        });
    });

    describe("Valoocanth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valoocanth'],
                    hand: ['troll', 'autocannon']
                },
                player2: {
                    inPlay: ['redlock']
                }
            });
        });

        it('after reap, should exhaust enemy creature', function () {
            this.player1.reap(this.valoocanth);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.valoocanth);
            this.player1.clickCard(this.redlock);
            expect(this.redlock.exhausted).toBe(true);
        });
    });
});
