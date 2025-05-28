describe('Salvatorem', function () {
    describe("Salvatorem's ability", function () {
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
                    inPlay: ['salvatorem', 'raiding-knight', 'the-grey-rider']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'troll']
                }
            });

            this.raidingKnight.tokens.amber = 1;
            this.krump.tokens.amber = 1;
        });

        it('should prevent damage to ready creatures with amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.raidingKnight);
            expect(this.raidingKnight.location).toBe('play area');
            expect(this.raidingKnight.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not prevent damage to exhausted creatures with amber', function () {
            this.player1.fightWith(this.raidingKnight, this.troll);
            expect(this.raidingKnight.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not prevent damage to ready creatures without amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.theGreyRider);
            expect(this.theGreyRider.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be put into play under opponent control when fate is triggered', function () {
            this.player1.moveCard(this.salvatorem, 'hand');
            this.player1.activateProphecy(this.overreach, this.salvatorem);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.salvatorem.location).toBe('play area');
            expect(this.salvatorem.controller).toBe(this.player1.player);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
