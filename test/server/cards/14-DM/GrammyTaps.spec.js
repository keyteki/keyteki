describe('Grammy Taps', function () {
    describe("Grammy Taps's neighbors", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['troll', 'grammy-taps', 'krump', 'alaka']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('gain elusive while Grammy Taps is exhausted', function () {
            this.player1.reap(this.grammyTaps);
            expect(this.grammyTaps.exhausted).toBe(true);
            expect(this.troll.hasKeyword('elusive')).toBe(true);
            expect(this.krump.hasKeyword('elusive')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('do not gain elusive while Grammy Taps is ready', function () {
            expect(this.grammyTaps.exhausted).toBe(false);
            expect(this.troll.hasKeyword('elusive')).toBe(false);
            expect(this.krump.hasKeyword('elusive')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lose elusive after Grammy Taps readies at the end of turn', function () {
            this.player1.reap(this.grammyTaps);
            expect(this.troll.hasKeyword('elusive')).toBe(true);
            expect(this.krump.hasKeyword('elusive')).toBe(true);
            this.player1.endTurn();
            this.player1.clickCard(this.grammyTaps);
            this.player1.clickPrompt('done');
            expect(this.grammyTaps.exhausted).toBe(false);
            expect(this.troll.hasKeyword('elusive')).toBe(false);
            expect(this.krump.hasKeyword('elusive')).toBe(false);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not affect non-neighbors', function () {
            this.player1.reap(this.grammyTaps);
            expect(this.alaka.hasKeyword('elusive')).toBe(false);
            expect(this.bumpsy.hasKeyword('elusive')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Entrench', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['grammy-taps']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });

            this.grammyTaps.exhaust();
            this.player1.endTurn();
        });

        it('lets the controller leave Grammy Taps exhausted during their ready phase', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickPrompt('done');
            expect(this.grammyTaps.exhausted).toBe(true);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('readies Grammy Taps when selected', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickCard(this.grammyTaps);
            this.player1.clickPrompt('done');
            expect(this.grammyTaps.exhausted).toBe(false);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
