describe('Recyclops', function () {
    describe("Recyclops's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['recyclops', 'echofly'],
                    hand: ['troll']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('discards a card then adds two +1 power counters to a creature', function () {
            this.player1.reap(this.recyclops);
            // first prompt: choose card to discard from hand
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            // second prompt: choose creature for power counters
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.recyclops);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target enemy creature for power counters', function () {
            this.player1.reap(this.recyclops);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Recyclops with empty hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['recyclops', 'echofly']
                },
                player2: {}
            });
            // Empty hand
            for (const card of [...this.player1.player.hand]) {
                this.player1.moveCard(card, 'discard');
            }
        });

        it('does nothing if hand is empty', function () {
            this.player1.reap(this.recyclops);
            expect(this.echofly.powerCounters).toBeFalsy();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
