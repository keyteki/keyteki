describe('Bog Spitter', function () {
    describe("Bog Spitter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['bog-spitter', 'poke'],
                    inPlay: ['ritual-of-balance', 'murmook']
                },
                player2: {
                    amber: 6,
                    hand: ['mind-barb'],
                    inPlay: ['flaxia']
                }
            });
            this.player1.chains = 36;
            this.player2.chains = 36;
        });

        it('can discard opponent card on fight', function () {
            this.player1.playCreature(this.bogSpitter);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.bogSpitter, this.flaxia);
            this.player1.clickPrompt("Opponent's");
            expect(this.mindBarb.location).toBe('discard');
            expect(this.poke.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can discard controller card on fight', function () {
            this.player1.playCreature(this.bogSpitter);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.bogSpitter, this.flaxia);
            this.player1.clickPrompt('Mine');
            expect(this.poke.location).toBe('discard');
            expect(this.mindBarb.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can steal 1 on scrap', function () {
            this.player1.scrap(this.bogSpitter);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot steal 1 on scrap if opponent has less than 6', function () {
            this.player1.useAction(this.ritualOfBalance);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            this.player1.scrap(this.bogSpitter);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
