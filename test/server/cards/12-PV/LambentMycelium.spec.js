describe('Lambent Mycelium', function () {
    describe("Lambent Mycelium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['lambent-mycelium', 'dew-faerie'],
                    inPlay: ['dust-pixie', 'cpo-zytar', 'dark-harbinger']
                },
                player2: {
                    amber: 4,
                    hand: ['troll'],
                    inPlay: ['krump', 'culf-the-quiet']
                }
            });
        });

        it('should gain 2 power counters when another creature enters play', function () {
            this.player1.playCreature(this.lambentMycelium);
            this.player1.playCreature(this.dewFaerie);
            expect(this.lambentMycelium.power).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain 2 power counters when enemy creature enters play', function () {
            this.player1.playCreature(this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.lambentMycelium.power).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain power counters when itself enters play', function () {
            this.player1.playCreature(this.lambentMycelium);
            expect(this.lambentMycelium.power).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give taunt to most powerful enemy creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).toBeAbleToSelect(this.darkHarbinger);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.culfTheQuiet);
            this.player2.clickCard(this.cpoZytar);
            this.player2.clickCard(this.culfTheQuiet);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).not.toBeAbleToSelect(this.darkHarbinger);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.cpoZytar);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give taunt to most powerful enemy creature only for the remainder of the turn', function () {
            this.player1.activateProphecy(this.overreach, this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.clickCard(this.cpoZytar);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.culfTheQuiet);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).toBeAbleToSelect(this.darkHarbinger);
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.darkHarbinger);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
