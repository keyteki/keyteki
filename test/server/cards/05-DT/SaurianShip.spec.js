describe('Saurian Ship', function () {
    describe("Saurian Ship's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: [
                        'saurian-ship',
                        'senator-shrix',
                        'citizen-shrix',
                        'flaxia',
                        'saurian-egg'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['armsmaster-molina', 'troll', 'groggins']
                }
            });
        });

        it('should exhaust up to 5 creatures and deal damage to enemy creatures', function () {
            this.player1.useAction(this.saurianShip);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.citizenShrix);
            expect(this.player1).toBeAbleToSelect(this.saurianEgg);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.armsmasterMolina);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.citizenShrix);
            this.player1.clickCard(this.senatorShrix);
            this.player1.clickCard(this.saurianEgg);
            this.player1.clickPrompt('Done');
            expect(this.saurianEgg.exhausted).toBe(true);
            expect(this.senatorShrix.exhausted).toBe(true);
            expect(this.citizenShrix.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            expect(this.armsmasterMolina.exhausted).toBe(false);
            expect(this.groggins.exhausted).toBe(false);

            expect(this.saurianEgg.tokens.damage).toBeUndefined();
            expect(this.citizenShrix.tokens.damage).toBeUndefined();
            expect(this.senatorShrix.tokens.damage).toBeUndefined();
            expect(this.flaxia.tokens.damage).toBeUndefined();

            expect(this.troll.tokens.damage).toBe(3);
            expect(this.groggins.tokens.damage).toBe(3);
            expect(this.armsmasterMolina.tokens.damage).toBe(3);
        });
    });
});
