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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2 power counters when enemy creature enters play', function () {
            this.player1.playCreature(this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.lambentMycelium.power).toBe(4);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not gain power counters when itself enters play', function () {
            this.player1.playCreature(this.lambentMycelium);
            expect(this.lambentMycelium.power).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give taunt to each tied most powerful enemy creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.clickCard(this.culfTheQuiet);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).toBeAbleToSelect(this.darkHarbinger);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.cpoZytar);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should dynamically update taunt if the most powerful enemy creature changes mid-turn', function () {
            this.player1.moveCard(this.darkHarbinger, 'discard');
            this.player1.moveCard(this.dewFaerie, 'play area');
            this.player2.moveCard(this.troll, 'play area');
            this.cpoZytar.damage = this.cpoZytar.power - 1;

            this.player1.activateProphecy(this.overreach, this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);

            this.player2.clickCard(this.culfTheQuiet);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.cpoZytar);
            expect(this.cpoZytar.location).toBe('discard');

            this.player2.clickCard(this.troll);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.dewFaerie);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.dewFaerie);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should give taunt to most powerful enemy creature only for the remainder of the turn', function () {
            this.player1.activateProphecy(this.overreach, this.lambentMycelium);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
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
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
