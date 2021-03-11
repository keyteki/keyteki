describe('Encounter Suit', function () {
    describe("Encounter Suit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina'],
                    hand: ['encounter-suit']
                },
                player2: {
                    hand: ['mark-of-dis']
                }
            });

            this.player1.playUpgrade(this.encounterSuit, this.armsmasterMolina);
        });

        it('ward before the card effect resolves', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.markOfDis);
            expect(this.armsmasterMolina.warded).toBe(true);
            expect(this.player2).toBeAbleToSelect(this.armsmasterMolina);
            this.player2.clickCard(this.armsmasterMolina);
            expect(this.armsmasterMolina.warded).toBe(false);
        });
    });

    describe("Encounter Suit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['armsmaster-molina'],
                    hand: ['encounter-suit', 'wild-wormhole']
                },
                player2: {
                    hand: ['mark-of-dis']
                }
            });

            this.player1.moveCard(this.encounterSuit, 'deck');
        });

        it('action that played it (Wild Wormwhole) should not trigger it', function () {
            this.player1.play(this.wildWormhole);
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            this.player1.clickCard(this.armsmasterMolina);
            expect(this.armsmasterMolina.warded).toBe(false);
        });
    });
});
