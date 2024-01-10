describe('Siphonapterian', function () {
    describe("Siphonapterian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['hire-on'],
                    inPlay: ['cpo-zytar', 'the-old-tinker', 'siphonapterian', 'gemcoat-vendor'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('gains taunt when haunted', function () {
            expect(this.siphonapterian.hasKeyword('taunt')).toBe(false);
            this.player1.play(this.hireOn);
            expect(this.siphonapterian.hasKeyword('taunt')).toBe(true);
        });

        it('gains 2 amber if killed not on your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.siphonapterian);
            expect(this.siphonapterian.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
        });

        it('does not gain 2 amber if killed on your turn', function () {
            this.player1.fightWith(this.siphonapterian, this.troll);
            expect(this.siphonapterian.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
        });
    });
});
