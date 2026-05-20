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
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;

            this.player1.endTurn();
            expect(this.player1.player.discard.length).toBe(p1Discard + 1);
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.awayTeam);
            this.player2.fightWith(this.cadet, this.kaupe);
            this.player2.clickCard(this.awayTeam);
            expect(this.player2.player.discard.length).toBe(p2Discard + 2); // token + discarded card
            this.player2.reap(this.awayTeam);
            this.player2.endTurn();
            expect(this.player1.player.discard.length).toBe(p1Discard + 1); // one card discarded from P1 deck during P1 ready phase
            this.player1.clickPrompt('unfathomable');
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards cards from opponent deck when readying their creature', function () {
            this.player1.playCreature(this.giltspineMesmerist);
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.awayTeam);
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.fightWith(this.skullbackCrab, this.cadet);
            this.player1.clickCard(this.awayTeam);
            expect(this.player1.player.discard.length).toBe(p1Discard + 2); // skullback, discarded card
            expect(this.player2.player.discard.length).toBe(p2Discard + 1); // cadet
            expect(this.player1).isReadyToTakeAction();
        });

        it('can discard from controller deck on scrap', function () {
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.scrap(this.giltspineMesmerist);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(p1Discard + 4);
            expect(this.player2.player.discard.length).toBe(p2Discard);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can discard from opponent deck on scrap', function () {
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.scrap(this.giltspineMesmerist);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1.player.discard.length).toBe(p1Discard + 1); // giltspine itself
            expect(this.player2.player.discard.length).toBe(p2Discard + 3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Giltspine Mesmerist + Nice to Greet You', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['nice-to-greet-you'],
                    inPlay: ['giltspine-mesmerist', 'myx-the-tallminded']
                },
                player2: {
                    inPlay: ['mindwarper']
                }
            });
        });

        it('discards a single card from the active player deck when readying both a friendly and an enemy creature', function () {
            this.myxTheTallminded.exhaust();
            this.mindwarper.exhaust();
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.play(this.niceToGreetYou);
            expect(this.myxTheTallminded.exhausted).toBe(false);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.player1.player.discard.length).toBe(p1Discard + 2);
            expect(this.player2.player.discard.length).toBe(p2Discard);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
