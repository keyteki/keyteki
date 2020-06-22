describe('Smite', function () {
    describe("Smite's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['sequis', 'helper-bot']
                },
                player2: {
                    inPlay: ['murmook', 'mighty-tiger', 'troll']
                }
            });
        });

        it('should cause a creature to fight, and then deal 2 damage to its neighbors', function () {
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Sequis');
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.murmook.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it("should remove creature's stun", function () {
            this.sequis.stunned = true;
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.sequis);
            expect(this.sequis.stunned).toBe(false);
            expect(this.player1).not.toHavePrompt('Sequis');
        });

        it("should remove creature's stun and not damage it", function () {
            this.helperBot.stunned = true;
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.stunned).toBe(false);
            expect(this.player1).not.toHavePrompt('Helper Bot');
            expect(this.helperBot.location).toBe('play area');
            expect(this.helperBot.hasToken('damage')).toBe(false);
        });
    });
    describe("Smite's ability with duma", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['sequis', 'helper-bot']
                },
                player2: {
                    inPlay: ['murmook', 'duma-the-martyr', 'troll']
                }
            });
            this.troll.tokens['damage'] = 7;
            this.murmook.tokens['damage'] = 2;
        });

        it('should cause a creature to fight, Duma will heal neighbors, and then deal 2 damage to its neighbors', function () {
            this.player1.play(this.smite);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Sequis');
            expect(this.player1).toBeAbleToSelect(this.dumaTheMartyr);
            this.player1.clickCard(this.dumaTheMartyr);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.murmook.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
        });
    });
});
