describe('Rigged Lottery', function () {
    describe("Rigged Lottery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['rigged-lottery'],
                    discard: [
                        'bad-penny',
                        'lamindra',
                        'troll',
                        'krump',
                        'anger',
                        'brammo',
                        'foozle',
                        'groggins'
                    ]
                },
                player2: {
                    discard: [
                        'gamgee',
                        'furtive-investors',
                        'knuckles-bolton',
                        'snufflegator',
                        'bingle-bangbang',
                        'cowfyne',
                        'drummernaut',
                        'groke'
                    ]
                }
            });

            this.player1.moveCard(this.groggins, 'deck');
            this.player1.moveCard(this.foozle, 'deck');
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.moveCard(this.badPenny, 'deck');

            this.player2.moveCard(this.groke, 'deck');
            this.player2.moveCard(this.drummernaut, 'deck');
            this.player2.moveCard(this.cowfyne, 'deck');
            this.player2.moveCard(this.snufflegator, 'deck');
            this.player2.moveCard(this.bingleBangbang, 'deck');
            this.player2.moveCard(this.knucklesBolton, 'deck');
            this.player2.moveCard(this.furtiveInvestors, 'deck');
            this.player2.moveCard(this.gamgee, 'deck');
        });

        it('should discard top 5 cards from both decks and gain amber for shadows cards', function () {
            this.player1.play(this.riggedLottery);
            expect(this.badPenny.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.gamgee.location).toBe('discard');
            expect(this.furtiveInvestors.location).toBe('discard');
            expect(this.knucklesBolton.location).toBe('discard');
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain no amber from ability when no shadows cards are discarded', function () {
            this.player1.moveCard(this.badPenny, 'discard');
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.play(this.riggedLottery);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
