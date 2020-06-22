describe('Ragnarok', function () {
    describe("Ragnarok's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'krump'],
                    hand: ['ragnarok']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'shooler', 'helper-bot'],
                    hand: ['dextre']
                }
            });
        });

        it('should stop all creatures from reaping, fight should gain player 1 amber', function () {
            this.player1.play(this.ragnarok);
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.krump);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Ragnarok');
            expect(this.player1.amber).toBe(2);
            expect(this.lamindra.location).toBe('discard');
            this.player1.endTurn();

            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');
        });

        it('should last for only 1 round', function () {
            this.player1.play(this.ragnarok);
            this.player1.endTurn();

            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');

            this.player2.clickPrompt('logos');
            this.player2.playCreature('dextre');
            this.dextre.exhausted = false;
            this.player2.reap(this.dextre);
            this.player2.endTurn();

            expect(this.dextre.location).toBe('play area');
        });
    });

    describe("Ragnarok's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['redlock'],
                    hand: ['ragnarok']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'shooler', 'helper-bot'],
                    hand: ['dextre']
                }
            });
        });

        it('should gain amber from Redlock if no creature was played', function () {
            this.player1.play(this.ragnarok);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.redlock.location).toBe('discard');
        });
    });
});
