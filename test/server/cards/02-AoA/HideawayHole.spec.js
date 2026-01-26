describe('HideawayHole', function () {
    describe("HideawayHole's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 2,
                    inPlay: ['hideaway-hole', 'murkens', 'brend-the-fanatic'],
                    hand: ['dodger']
                },
                player2: {
                    amber: 0,
                    inPlay: ['maruck-the-marked', 'teliga', 'witch-of-the-wilds'],
                    hand: ['bulwark']
                }
            });
        });

        it('should make own creatures in play elusive', function () {
            this.player1.useOmni(this.hideawayHole);
            expect(this.hideawayHole.location).toBe('discard');
            this.player1.fightWith(this.brendTheFanatic, this.witchOfTheWilds);
            expect(this.witchOfTheWilds.damage).toBe(3);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.teliga, this.murkens);

            expect(this.teliga.damage).toBe(0);
            expect(this.murkens.damage).toBe(0);
        });

        it('should make creatures played after it was used elusive', function () {
            this.player1.useOmni(this.hideawayHole);
            expect(this.hideawayHole.location).toBe('discard');
            this.player1.play(this.dodger);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.teliga, this.dodger);

            expect(this.teliga.damage).toBe(0);
            expect(this.dodger.damage).toBe(0);
        });

        it('have the effect expire at the start of next turn', function () {
            this.player1.clickCard(this.hideawayHole);
            this.player1.clickPrompt("Use this card's Omni ability");

            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('shadows');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.teliga, this.murkens);

            expect(this.teliga.damage).toBe(2);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'shadows',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'hideaway-hole', 'dodger']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['teliga']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'shadows');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect opponent's next turn", function () {
            this.player1.useOmni(this.hideawayHole);
            this.player1.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.teliga, this.dodger);
            expect(this.dodger.damage).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
