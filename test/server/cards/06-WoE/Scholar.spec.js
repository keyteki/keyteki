describe('Scholar', function () {
    describe("Scholar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'scholar',
                    amber: 1,
                    inPlay: ['scholar:the-shadow-council'],
                    hand: ['helper-bot', 'borrow', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it("should not get versus card's effect", function () {
            expect(this.scholar.getKeywordValue('elusive')).toBe(0);
            this.player1.clickCard(this.scholar);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
        });

        it('should draw a card after reap', function () {
            expect(this.player1.hand.length).toBe(3);
            this.player1.reap(this.scholar);
            expect(this.player1.amber).toBe(2);
            expect(this.player1.hand.length).toBe(4);
            this.player1.endTurn();
        });
    });

    describe('and persistent effects', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    token: 'trader',
                    amber: 1,
                    inPlay: ['trader:trimble', 'shĭsnyasĭ-buggy', 'pismire'],
                    hand: ['piranha-monkeys']
                },
                player2: {
                    amber: 1,
                    token: 'scholar',
                    inPlay: ['scholar:tentaclid', 'seabringer-kekoa']
                }
            });
        });

        it('should not copy keywork effects', function () {
            expect(this.scholar.id).toBe('tentaclid');
            expect(this.scholar.name).toBe('Scholar');
            expect(this.scholar.hasKeyword('skirmish')).toBe(false);
            expect(this.scholar.hasKeyword('taunt')).toBe(false);
        });

        it('should not apply persistent effects', function () {
            expect(this.trader.id).toBe('trimble');
            expect(this.trader.name).toBe('Trader');
            expect(this.trader.hasKeyword('skirmish')).toBe(false);
            expect(this.shĭsnyasĭBuggy.hasKeyword('skirmish')).toBe(false);
            expect(this.pismire.hasKeyword('skirmish')).toBe(false);
        });

        it('should leave play when destroyed', function () {
            this.player1.play(this.piranhaMonkeys);
            expect(this.trader.location).toBe('discard');
        });
    });
});
