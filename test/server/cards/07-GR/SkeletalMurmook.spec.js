describe('Skeletal Murmook', function () {
    describe("Skeletal Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['the-common-cold'],
                    inPlay: ['skeletal-murmook'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 7,
                    inPlay: ['dextre']
                }
            });
            this.player1.chains = 36;
        });

        it('does not affect key cost when not haunted', function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(1);
        });

        it('shuffles flank creatures twice into deck when haunted', function () {
            this.player1.play(this.theCommonCold);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player2.amber).toBe(7);
            this.player2.reap(this.dextre);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(0);
        });
    });
});
