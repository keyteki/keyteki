describe('Veil of Ectoplasm', function () {
    describe("Veil of Ectoplasm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['veil-of-ectoplasm', 'a-strong-feeling'],
                    inPlay: ['echofly', 'flaxia'],
                    discard: ['shadys', 'purse-a-phone', 'full-moon', 'call-of-need']
                },
                player2: {
                    amber: 6,
                    inPlay: ['thing-from-the-deep', 'dust-pixie'],
                    discard: ['mender']
                }
            });
        });

        it('captures 1 A on friendly creatures for each geistoid card in the discard', function () {
            this.player1.play(this.veilOfEctoplasm);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.echofly);
            this.player1.clickCard(this.echofly);
            this.player1.clickCard(this.flaxia);
            expect(this.echofly.amber).toBe(2);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
