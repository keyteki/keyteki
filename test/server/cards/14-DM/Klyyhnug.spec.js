describe('Klyyhnug', function () {
    describe("Klyyhnug's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['klyyhnug'],
                    hand: ['urchin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('removes power counters and archives a card', function () {
            this.troll.tokens.power = 2;
            this.player1.reap(this.klyyhnug);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Yes');
            expect(this.troll.powerCounters).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips archive if no counters were removed', function () {
            this.player1.reap(this.klyyhnug);
            this.player1.clickPrompt('No');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
