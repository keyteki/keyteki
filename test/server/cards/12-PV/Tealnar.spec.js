describe('Tealnar', function () {
    describe("Tealnar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['tealnar'],
                    inPlay: ['searine', 'bulwark']
                },
                player2: {
                    amber: 4,
                    inPlay: ['culf-the-quiet', 'troll']
                }
            });
        });

        it('should heal neighbors after fight', function () {
            this.player1.playCreature(this.tealnar, true);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.tealnar);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.bulwark);
            this.searine.tokens.damage = 2;
            this.tealnar.tokens.damage = 1;
            this.troll.tokens.damage = 1;
            this.player1.fightWith(this.bulwark, this.culfTheQuiet);
            expect(this.searine.tokens.damage).toBeUndefined();
            expect(this.tealnar.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.culfTheQuiet.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fully heal creatures and give opponent amber when fate is triggered', function () {
            this.searine.tokens.damage = 2;
            this.troll.tokens.damage = 3;
            this.player1.activateProphecy(this.overreach, this.tealnar);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.culfTheQuiet);
            expect(this.searine.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.tealnar.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
