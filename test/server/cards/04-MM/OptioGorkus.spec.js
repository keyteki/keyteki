describe('Optio Gorkus', function () {
    describe("Optio Gorkus' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'optio-gorkus',
                        'citizen-shrix',
                        'orator-hissaro',
                        'questor-jarta',
                        'optio-gorkus',
                        'rhetor-gallim',
                        'optio-gorkus',
                        'senator-shrix'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'alaka']
                }
            });

            this.optioGorkus1 = this.player1.player.creaturesInPlay[0];
            this.optioGorkus2 = this.player1.player.creaturesInPlay[4];
            this.optioGorkus3 = this.player1.player.creaturesInPlay[6];

            this.citizenShrix.tokens.amber = 3;
            this.oratorHissaro.tokens.amber = 4;
            this.rhetorGallim.tokens.amber = 5;
            this.optioGorkus3.tokens.amber = 1;
        });

        it('should not be prompted if destroyed card has no amber', function () {
            this.player1.fightWith(this.senatorShrix, this.troll);
            expect(this.senatorShrix.location).toBe('discard');

            expect(this.optioGorkus1.amber).toBe(0);
            expect(this.citizenShrix.amber).toBe(3);
            expect(this.oratorHissaro.amber).toBe(4);
            expect(this.questorJarta.amber).toBe(0);
            expect(this.optioGorkus2.amber).toBe(0);
            expect(this.rhetorGallim.amber).toBe(5);
            expect(this.optioGorkus3.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should not be prompted if destroyed card has no Optio Gorkus' neighbor", function () {
            this.player1.fightWith(this.oratorHissaro, this.troll);
            expect(this.oratorHissaro.location).toBe('discard');

            expect(this.optioGorkus1.amber).toBe(0);
            expect(this.citizenShrix.amber).toBe(3);
            expect(this.oratorHissaro.amber).toBe(0);
            expect(this.questorJarta.amber).toBe(0);
            expect(this.optioGorkus2.amber).toBe(0);
            expect(this.rhetorGallim.amber).toBe(5);
            expect(this.optioGorkus3.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(8);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should prompt if card has amber and one Optio Gorkus' neighbor", function () {
            this.player1.fightWith(this.citizenShrix, this.troll);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.optioGorkus1);
            expect(this.player1).not.toBeAbleToSelect(this.optioGorkus2);
            expect(this.player1).not.toBeAbleToSelect(this.optioGorkus3);

            this.player1.clickCard(this.optioGorkus1);

            expect(this.citizenShrix.location).toBe('discard');

            expect(this.optioGorkus1.amber).toBe(3);
            expect(this.citizenShrix.amber).toBe(0);
            expect(this.oratorHissaro.amber).toBe(4);
            expect(this.questorJarta.amber).toBe(0);
            expect(this.optioGorkus2.amber).toBe(0);
            expect(this.rhetorGallim.amber).toBe(5);
            expect(this.optioGorkus3.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should prompt if card has amber and two Optio Gorkus' neighbor", function () {
            this.player1.fightWith(this.rhetorGallim, this.troll);

            this.player1.clickCard(this.rhetorGallim);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.optioGorkus2);
            expect(this.player1).toBeAbleToSelect(this.optioGorkus3);
            this.player1.clickCard(this.optioGorkus3);

            expect(this.rhetorGallim.location).toBe('discard');

            expect(this.optioGorkus1.amber).toBe(0);
            expect(this.citizenShrix.amber).toBe(3);
            expect(this.oratorHissaro.amber).toBe(4);
            expect(this.questorJarta.amber).toBe(0);
            expect(this.optioGorkus2.amber).toBe(0);
            expect(this.rhetorGallim.amber).toBe(0);
            expect(this.optioGorkus3.amber).toBe(6);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("when destroyed by opponent, should prompt if card has amber and two Optio Gorkus' neighbor", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.rhetorGallim);

            this.player2.clickCard(this.rhetorGallim);
            expect(this.player2).toHavePrompt('Choose a creature');
            expect(this.player2).toBeAbleToSelect(this.optioGorkus2);
            expect(this.player2).toBeAbleToSelect(this.optioGorkus3);
            this.player2.clickCard(this.optioGorkus2);

            expect(this.rhetorGallim.location).toBe('discard');

            expect(this.optioGorkus1.amber).toBe(0);
            expect(this.citizenShrix.amber).toBe(3);
            expect(this.oratorHissaro.amber).toBe(4);
            expect(this.questorJarta.amber).toBe(0);
            expect(this.optioGorkus2.amber).toBe(5);
            expect(this.rhetorGallim.amber).toBe(0);
            expect(this.optioGorkus3.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);

            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
