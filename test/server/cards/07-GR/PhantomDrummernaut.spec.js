describe('Phantom Drummernaut', function () {
    describe("Phantom Drummernaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['phantom-drummernaut', 'press-gang'],
                    discard: new Array(6).fill('poke').concat(['troll', 'cpo-zytar', 'anger']) // not yet haunted
                },
                player2: {
                    inPlay: ['thing-from-the-deep', 'hunting-witch'],
                    discard: ['flaxia']
                }
            });
            this.player1.playCreature(this.phantomDrummernaut);
            this.player1.chains = 36;
        });

        it('on play brings a creature from your discard to your hand', function () {
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
                this.player1.moveCard(this.troll, 'discard');
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                expect(this.troll.location).toBe('discard');
            });

            it('on fight brings a creature from your discard to your hand', function () {
                this.player1.fightWith(this.phantomDrummernaut, this.huntingWitch);
                this.player1.clickCard(this.troll);
                expect(this.troll.location).toBe('hand');
                expect(this.player1).isReadyToTakeAction();
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.phantomDrummernaut, this.thingFromTheDeep);
                expect(this.phantomDrummernaut.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.pressGang);
                this.player1.fightWith(this.phantomDrummernaut, this.thingFromTheDeep);
                expect(this.phantomDrummernaut.location).toBe('archives');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
