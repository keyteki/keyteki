describe('Molluscaller', function () {
    describe("Molluscaller's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'strange-shell',
                    inPlay: [
                        'molluscaller',
                        'strange-shell:antiquities-dealer',
                        'strange-shell:shrewd-investor'
                    ]
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });

            this.strangeShell2 = this.player1.player.creaturesInPlay[2];
        });

        it('should give Strange Shells more power', function () {
            expect(this.strangeShell.power).toBe(1);
            this.player1.reap(this.molluscaller);
            expect(this.strangeShell.power).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should blank Strange Shells', function () {
            this.player1.reap(this.molluscaller);
            this.player1.reap(this.strangeShell);
            expect(this.player1.amber).toBe(2);
            this.player1.clickCard(this.strangeShell2);
            expect(this.player1).not.toHavePrompt("Use this card's Action ability");
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.batdrone);
            expect(this.strangeShell2.exhausted).toBe(true);
            expect(this.strangeShell2.tokens.damage).toBe(2);
        });
    });
});
