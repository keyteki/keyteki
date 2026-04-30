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
            this.troll.powerCounters = 2;
            this.player1.reap(this.klyyhnug);
            this.player1.clickCard(this.troll);
            expect(this.troll.powerCounters).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips the ability when Done is clicked', function () {
            this.player1.reap(this.klyyhnug);
            this.player1.clickPrompt('Done');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a creature with no power counters but does not archive', function () {
            this.player1.reap(this.klyyhnug);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target itself', function () {
            this.klyyhnug.powerCounters = 2;
            this.player1.reap(this.klyyhnug);
            expect(this.player1).toBeAbleToSelect(this.klyyhnug);
            this.player1.clickCard(this.klyyhnug);
            expect(this.klyyhnug.powerCounters).toBe(0);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
