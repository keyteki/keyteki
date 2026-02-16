describe('Dark Amber Vault', function () {
    describe("Dark Amber Vault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['cephaloist', 'flaxia', 'dark-æmber-vault'],
                    hand: [
                        'bumblebird',
                        'fertility-chant',
                        'sacro-beast',
                        'fandangle',
                        'shooler',
                        'gub'
                    ]
                },
                player2: {
                    inPlay: ['dextre', 'bull-wark'],
                    hand: ['archimedes', 'archimedes', 'archimedes', 'bot-bookton']
                }
            });
        });

        it('should increase power of friendly mutant creatures', function () {
            expect(this.cephaloist.power).toBe(6);
            expect(this.flaxia.power).toBe(4);
            expect(this.dextre.power).toBe(3);
            expect(this.bullWark.power).toBe(4);
        });

        it('should draw a card when playing a mutant creature', function () {
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(4);

            this.player1.play(this.bumblebird);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.player2.player.hand.length).toBe(4);
            this.player1.play(this.fandangle);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.player2.player.hand.length).toBe(4);
            this.player1.play(this.fertilityChant);
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.player2.player.hand.length).toBe(4);
            this.player1.play(this.sacroBeast);
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.player2.player.hand.length).toBe(4);
        });

        it('opponent should not draw when playing a mutant creature', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(4);
            this.player2.clickPrompt('logos');
            this.player2.play(this.botBookton);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(3);
        });
    });
});
