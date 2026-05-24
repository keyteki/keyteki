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
            expect(this.player1.player.discard.length).toBe(p1Discard + 3); // giltspine, kaupe, frigorific rod
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.awayTeam);
            this.player2.fightWith(this.cadet, this.kaupe);
            this.player2.clickCard(this.awayTeam);
            expect(this.player2.player.discard.length).toBe(p2Discard + 2); // away team, cadet
            this.player2.reap(this.awayTeam);
            this.player2.endTurn();
            expect(this.player1.player.discard.length).toBe(p1Discard + 3); // no change
            this.player1.clickPrompt('unfathomable');
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards from the active player deck when readying an enemy creature', function () {
            this.player1.playCreature(this.giltspineMesmerist);
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.awayTeam);
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.fightWith(this.skullbackCrab, this.cadet);
            this.player1.clickCard(this.awayTeam);
            expect(this.player1.player.discard.length).toBe(p1Discard + 2); // skullback + discard from readying away team
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
            expect(this.player1.player.discard.length).toBe(p1Discard + 1);
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

        it('discards one card from the active player deck for each creature readied when readying both a friendly and an enemy creature', function () {
            this.myxTheTallminded.exhaust();
            this.mindwarper.exhaust();
            const p1Discard = this.player1.player.discard.length;
            const p2Discard = this.player2.player.discard.length;
            this.player1.play(this.niceToGreetYou);
            expect(this.myxTheTallminded.exhausted).toBe(false);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.player1.player.discard.length).toBe(p1Discard + 3); // nice to greet you + one per readied creature
            expect(this.player2.player.discard.length).toBe(p2Discard);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Giltspine Mesmerist + Quintrino Warp ordering with empty deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['exile'],
                    inPlay: ['giltspine-mesmerist', 'prospector:subject-kirby', 'away-team'],
                    token: 'prospector'
                },
                player2: {
                    hand: ['quintrino-warp'],
                    inPlay: ['troll', 'cadet:cpo-zytar', 'cadet:cpo-zytar', 'krump'],
                    discard: ['kaupe', 'skullback-crab'],
                    token: 'cadet'
                }
            });
            this.cadet1 = this.player2.inPlay[1];
            this.cadet2 = this.player2.inPlay[2];
        });

        it('lets the player order destroyed triggers so Prospector refills the deck before Giltspine discards', function () {
            this.troll.exhaust();
            this.krump.exhaust();
            this.player1.player.deck = [];
            this.player2.player.deck = [];
            this.player1.play(this.exile);
            this.player1.clickCard(this.prospector);
            this.player1.clickPrompt('right');
            this.player1.endTurn();

            // Destroy Cadets and Prospectors
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.quintrinoWarp);
            this.player2.clickCard(this.prospector);
            this.player2.clickCard(this.awayTeam);

            // Use Cadet to ready - deck is empty so no discard
            this.player2.clickCard(this.cadet1);
            this.player2.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.player2.player.discard).toEqual([this.kaupe, this.skullbackCrab]);

            // Use Prospector draw and flip the discard
            this.player2.clickCard(this.prospector);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.deck.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(0);

            // Use second Cadet to ready and discard one card
            expect(this.giltspineMesmerist.location).toBe('play area');
            this.player2.clickCard(this.cadet2);
            this.player2.clickCard(this.krump);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(4);
            expect(this.player2.player.discard[0].name).toBe('Quintrino Warp');
            expect(this.player2.player.discard[1].name).toBe('CPO Zytar');
            expect(this.player2.player.discard[2].name).toBe('CPO Zytar');
            expect(['Kaupe', 'Skullback Crab']).toContain(this.player2.player.discard[3].name);

            expect(this.player2).isReadyToTakeAction();
        });
    });
});
