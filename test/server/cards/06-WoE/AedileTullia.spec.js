describe('Aedile Tullia', function () {
    describe("Aedile Tullia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['grimlocus-dux', 'curse-of-vanity'],
                    inPlay: ['aedile-tullia', 'questor-jarta', 'grumpus:pelf']
                },
                player2: {
                    hand: ['curse-of-vanity'],
                    inPlay: ['questor-jarta']
                }
            });

            this.curseOfVanity2 = this.player2.player.hand[0];
            this.questorJarta2 = this.player2.player.creaturesInPlay[0];
        });

        it('make a token creature when exalting once', function () {
            this.player1.reap(this.questorJarta);
            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not make a token creature when exalting a token creature', function () {
            this.player1.play(this.curseOfVanity);
            this.player1.clickCard(this.grumpus);
            this.player1.clickCard(this.questorJarta2);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not make a token creature when enemy creature exalts', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.reap(this.questorJarta2);
            this.player2.clickCard(this.questorJarta2);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });

        it('make 2 token creatures when exalting twice', function () {
            this.player1.playCreature(this.grimlocusDux, true);
            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('onExalt');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not make a token creature when enemy exalts your creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.curseOfVanity2);
            this.player2.clickCard(this.questorJarta2);
            this.player2.clickCard(this.questorJarta);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
