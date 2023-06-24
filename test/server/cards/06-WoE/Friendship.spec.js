describe('Friendship', function () {
    describe("Friendship's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 4,
                    token: 'defender',
                    inPlay: ['paraguardian', 'revered-monk', 'chancellor-dexterus'],
                    hand: ['friendship', 'challe-the-safeguard', 'friendship']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'quixo-the-adventurer', 'dr-escotera', 'mother'],
                    discard: []
                }
            });

            this.friendship1 = this.player1.hand[0];
            this.friendship2 = this.player1.hand[2];
            this.player1.playUpgrade(this.friendship1, this.reveredMonk);
            this.chancellorDexterus.tokens.ward = 1;
        });

        describe('two damage is distributed among two creatures', function () {
            it('should split damage evenly without a prompt', function () {
                this.player1.fightWith(this.reveredMonk, this.batdrone);
                expect(this.reveredMonk.tokens.damage).toBe(undefined);
                expect(this.paraguardian.tokens.damage).toBe(1);
                expect(this.chancellorDexterus.tokens.damage).toBe(1);
                expect(this.chancellorDexterus.tokens.ward).toBe(1);
            });
        });

        describe('three damage is distributed among two creatures', function () {
            it('should give an extra prompt to distribute the one extra damage', function () {
                this.player1.fightWith(this.reveredMonk, this.quixoTheAdventurer);
                expect(this.player1).toHavePrompt('Friendship');
                expect(this.player1).not.toBeAbleToSelect(this.quixoTheAdventurer); // enemy creature
                expect(this.player1).toBeAbleToSelect(this.paraguardian);
                expect(this.player1).not.toBeAbleToSelect(this.reveredMonk); // friendly creature that was dealt damage
                expect(this.player1).toBeAbleToSelect(this.chancellorDexterus);
                this.player1.clickCard(this.paraguardian);
                expect(this.reveredMonk.tokens.damage).toBe(undefined);
                expect(this.paraguardian.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.tokens.damage).toBe(1);
                expect(this.chancellorDexterus.tokens.ward).toBe(1);
            });
        });

        describe('four damage is distributed among two creatures', function () {
            it('should split damage evenly without a prompt', function () {
                this.player1.fightWith(this.reveredMonk, this.drEscotera);
                expect(this.reveredMonk.tokens.damage).toBe(undefined);
                expect(this.paraguardian.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.tokens.ward).toBe(1);
            });
        });

        describe('five damage is distributed among two creatures', function () {
            it('can destroy a creature, including warded creatures', function () {
                this.player1.fightWith(this.reveredMonk, this.mother);
                expect(this.player1).toHavePrompt('Friendship');
                this.player1.clickCard(this.chancellorDexterus);
                expect(this.reveredMonk.tokens.damage).toBe(undefined);
                expect(this.paraguardian.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.location).toBe('discard');
            });
        });

        it('applies damage after armor', function () {
            this.player1.playCreature(this.challeTheSafeguard, true, true);
            this.player1.clickCard(this.chancellorDexterus);
            this.player1.fightWith(this.reveredMonk, this.mother);
            expect(this.player1).toHavePrompt('Friendship');
            expect(this.player1).not.toBeAbleToSelect(this.mother); // enemy creature
            expect(this.player1).toBeAbleToSelect(this.paraguardian);
            expect(this.player1).not.toBeAbleToSelect(this.reveredMonk); // friendly creature that was dealt damage
            expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
            this.player1.clickCard(this.paraguardian);
            expect(this.reveredMonk.tokens.damage).toBe(undefined);
            expect(this.paraguardian.tokens.damage).toBe(2);
            expect(this.challeTheSafeguard.tokens.damage).toBe(1);
            expect(this.chancellorDexterus.tokens.damage).toBe(undefined);
            expect(this.chancellorDexterus.tokens.ward).toBe(1);
        });

        describe('when damage is redirected onto a creature upgraded with Friendship', function () {
            it('does not redirect a second time', function () {
                this.player1.playUpgrade(this.friendship2, this.paraguardian);
                this.player1.fightWith(this.reveredMonk, this.drEscotera);
                expect(this.reveredMonk.tokens.damage).toBe(undefined);
                expect(this.paraguardian.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.tokens.damage).toBe(2);
                expect(this.chancellorDexterus.tokens.ward).toBe(1);
            });
        });
    });
});
