describe('Giltspine Mesmerist', function () {
    describe("Giltspine Mesmerist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['giltspine-mesmerist', 'kaupe', 'frigorific-rod', 'call-of-the-void'],
                    inPlay: ['skullback-crab']
                },
                player2: {
                    token: 'cadet',
                    inPlay: ['cadet:cpo-zytar', 'away-team']
                }
            });
        });

        it('discards cards from deck when readying', function () {
            this.player1.playCreature(this.giltspineMesmerist);
            this.player1.playCreature(this.kaupe);
            this.player1.play(this.frigorificRod);
            this.player1.endTurn();
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1.player.discard.length).toBe(3);
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.awayTeam);
            this.player2.fightWith(this.cadet, this.kaupe);
            this.player2.clickCard(this.awayTeam);
            expect(this.player2.player.discard.length).toBe(2); // token + discarded card
            this.player2.reap(this.awayTeam);
            this.player2.endTurn();
            expect(this.player2.player.discard.length).toBe(3);
        });

        it('discards cards from opponent deck when readying their creature', function () {
            this.player1.playCreature(this.giltspineMesmerist);
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.awayTeam);
            this.player1.fightWith(this.skullbackCrab, this.cadet);
            this.player1.clickCard(this.awayTeam);
            expect(this.player1.player.discard.length).toBe(3); // call of the void, skullback, discarded card
        });

        it('can discard from controller deck on scrap', function () {
            this.player1.scrap(this.giltspineMesmerist);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(4);
        });

        it('can discard from opponent deck on scrap', function () {
            this.player1.scrap(this.giltspineMesmerist);
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(3);
        });
    });
});
