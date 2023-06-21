describe('Martian Revolution', function () {
    describe("Martian Revolution's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['martian-revolution', 'soulkeeper'],
                    inPlay: ['rotgrub', 'ember-imp'],
                    deck: ['toad', 'toad']
                },
                player2: {
                    inPlay: ['bloodshard-imp']
                }
            });
        });

        it('should make 1 token creature for each friendly creature destroyed', function () {
            this.player1.play(this.martianRevolution);
            this.player1.clickPrompt('Left');
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Grumpus');
        });

        it('should not make a token creature for warded creatures', function () {
            this.rotgrub.tokens.ward = 1;
            this.player1.play(this.martianRevolution);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('play area');
            expect(this.bloodshardImp.location).toBe('play area');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
        });

        it('should not count destroyed enemy creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.playUpgrade(this.soulkeeper, this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.martianRevolution);
            this.player1.clickCard(this.bloodshardImp);
            this.player1.clickPrompt('Left');
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
        });
    });
});
