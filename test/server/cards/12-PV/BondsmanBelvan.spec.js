describe('Bondsman Belvan', function () {
    describe("Bondsman Belvan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['draining-touch'],
                    inPlay: ['bondsman-belvan', 'ember-imp', 'shard-of-greed']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'urchin', 'autocannon', 'gauntlet-of-command'],
                    discard: ['hunting-witch']
                }
            });

            this.player2.moveCard(this.huntingWitch, 'deck');
        });

        it('should look at and discard top card after fight', function () {
            this.player1.fightWith(this.bondsmanBelvan, this.urchin);
            this.player1.clickPrompt(this.huntingWitch.name);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should look at and discard top card after reap', function () {
            this.player1.reap(this.bondsmanBelvan);
            this.player1.clickPrompt(this.huntingWitch.name);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be optional to discard', function () {
            this.player1.reap(this.bondsmanBelvan);
            this.player1.clickPrompt('Leave on top of deck');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give control of a friendly artifact when fate is triggered', function () {
            this.player1.moveCard(this.bondsmanBelvan, 'hand');
            this.player1.activateProphecy(this.overreach, this.bondsmanBelvan);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.shardOfGreed);
            expect(this.player2).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player2).toBeAbleToSelect(this.autocannon);
            this.player2.clickCard(this.autocannon);
            expect(this.autocannon.controller).toBe(this.player1.player);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.autocannon.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
