describe('Synchronizer', function () {
    describe("Synchronizer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    inPlay: ['ancestral-timekeeper', 'tick-tock', 'chronometer', 'synchronizer']
                },
                player2: {
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.ancestralTimekeeper.tokens.time = 4;
            this.tickTock.tokens.time = 1;
            this.chronometer.tokens.time = 3;
        });

        it('grants friendly clocks a destroyed ability to move half of their time counters', function () {
            this.player1.fightWith(this.ancestralTimekeeper, this.thingFromTheDeep);
            expect(this.ancestralTimekeeper.location).toBe('discard');
            expect(this.synchronizer.tokens.time).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('rounds up the moved time tokens', function () {
            this.player1.fightWith(this.chronometer, this.thingFromTheDeep);
            expect(this.chronometer.location).toBe('discard');
            expect(this.synchronizer.tokens.time).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves time tokens to friendly clock as omni', function () {
            this.player1.fightWith(this.chronometer, this.thingFromTheDeep);
            expect(this.chronometer.location).toBe('discard');
            this.player1.useOmni(this.synchronizer);
            expect(this.player1).toBeAbleToSelect(this.ancestralTimekeeper);
            expect(this.player1).toBeAbleToSelect(this.tickTock);
            expect(this.player1).not.toBeAbleToSelect(this.chronometer);
            this.player1.clickCard(this.tickTock);
            expect(this.tickTock.tokens.time).toBe(3);
            this.player1.endTurn();
            this.player1.clickCard(this.tickTock);
            this.player1.clickCard(this.chronometer);
            this.player1.clickPrompt('Done');
            expect(this.chronometer.location).toBe('archives');
            expect(this.tickTock.location).toBe('discard');
            this.player2.clickPrompt('unfathomable');
        });
    });

    describe('double Synchronizer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['tick-tock', 'ancestral-timekeeper', 'synchronizer', 'synchronizer']
                },
                player2: {
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.synchronizer1 = this.player1.filterCardsByName('synchronizer', 'play area')[0];
            this.synchronizer2 = this.player1.filterCardsByName('synchronizer', 'play area')[1];
            this.ancestralTimekeeper.tokens.time = 4;
            this.tickTock.tokens.time = 3;
        });

        it('halves time counters sequentially so second Synchronizer gets fewer', function () {
            this.player1.fightWith(this.ancestralTimekeeper, this.thingFromTheDeep);
            this.player1.clickPrompt('Synchronizer');
            expect(this.ancestralTimekeeper.location).toBe('discard');
            expect(this.synchronizer1.tokens.time).toBe(2);
            expect(this.synchronizer2.tokens.time).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('rounds up for odd time counters with double Synchronizer', function () {
            this.player1.fightWith(this.tickTock, this.thingFromTheDeep);
            this.player1.clickPrompt('Synchronizer');
            expect(this.tickTock.location).toBe('discard');
            expect(this.synchronizer1.tokens.time).toBe(2);
            expect(this.synchronizer2.tokens.time).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('auto-resolves ordering when Autoresolve is clicked', function () {
            this.player1.fightWith(this.ancestralTimekeeper, this.thingFromTheDeep);
            this.player1.clickPrompt('Autoresolve');
            expect(this.ancestralTimekeeper.location).toBe('discard');
            expect(
                (this.synchronizer1.tokens.time || 0) + (this.synchronizer2.tokens.time || 0)
            ).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('auto-resolves all triggers when orderForcedAbilities is disabled', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.player1.fightWith(this.ancestralTimekeeper, this.thingFromTheDeep);
            expect(this.ancestralTimekeeper.location).toBe('discard');
            expect(
                (this.synchronizer1.tokens.time || 0) + (this.synchronizer2.tokens.time || 0)
            ).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
