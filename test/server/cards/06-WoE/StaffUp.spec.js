describe('Staff Up', function () {
    describe("Staff Up's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    token: 'grumpus',
                    inPlay: ['antiquities-dealer', 'transitory-philosopher'],
                    hand: ['staff-up', 'insurance-policy']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dominator-bauble', 'speed-sigil'],
                    hand: ['ether-spider']
                }
            });
        });

        it('causes tokens to be made instead of gaining amber', function () {
            this.player1.play(this.staffUp);
            this.player1.reap(this.antiquitiesDealer);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            expect(this.player1.amber).toBe(1);
        });

        it('causes tokens to be made instead of stealing', function () {
            this.player1.play(this.staffUp);
            this.player1.useAction(this.transitoryPhilosopher);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Grumpus');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should wear off next turn', function () {
            this.player1.play(this.staffUp);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');

            this.player1.reap(this.antiquitiesDealer);
            expect(this.player1.amber).toBe(2);
        });

        it('should let the active player choose with multiple effets (Staff Up)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.etherSpider);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.staffUp);
            this.player1.reap(this.antiquitiesDealer);
            this.player1.clickPrompt('Staff Up');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            expect(this.player1.amber).toBe(1);
            expect(this.etherSpider.tokens.amber).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should let the active player choose with multiple effets (Ether Spider)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.etherSpider);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.staffUp);
            this.player1.reap(this.antiquitiesDealer);
            this.player1.clickCard(this.etherSpider);
            expect(this.etherSpider.tokens.amber).toBe(1);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not cause tokens to be made when losing amber', function () {
            this.player1.play(this.staffUp);
            this.player1.playUpgrade(this.insurancePolicy, this.antiquitiesDealer);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
