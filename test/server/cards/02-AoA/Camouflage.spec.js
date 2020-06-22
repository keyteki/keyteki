describe('Camouflage', function () {
    describe("Camouflage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'mighty-tiger', 'dextre'],
                    hand: ['camouflage']
                },
                player2: {
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
            this.player1.playUpgrade(this.camouflage, this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('Sanctum');
        });

        it('should not allow creatures not on a flank to attack a creature with Camouflage', function () {
            this.player2.clickCard(this.bulwark);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.mightyTiger);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
        });

        it('should not allow a creature to fight if there are no legal targets', function () {
            this.player2.fightWith(this.sequis, this.mightyTiger);
            this.player2.fightWith(this.commanderRemiel, this.dextre);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            this.player2.clickCard(this.bulwark);
            expect(this.player2).toHavePrompt('Bulwark');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });
    });
});
