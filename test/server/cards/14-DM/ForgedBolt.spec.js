describe('Forged Bolt', function () {
    describe("Forged Bolt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['forged-bolt'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['murmook', 'krump']
                }
            });
        });

        it('deals no damage when no keys are forged', function () {
            this.player1.play(this.forgedBolt);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.murmook.tokens.damage).toBeUndefined();
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 1 to each creature for 1 forged key', function () {
            this.player1.player.keys.red = true;
            this.player1.play(this.forgedBolt);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.murmook.tokens.damage).toBe(1);
            expect(this.krump.tokens.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts forged keys from both players', function () {
            this.player1.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player2.player.keys.yellow = true;
            this.player1.play(this.forgedBolt);
            // 3 forged keys.
            expect(this.troll.tokens.damage).toBe(3);
            // murmook has 3 power, takes 3 dmg => dies
            expect(this.murmook.location).toBe('discard');
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
