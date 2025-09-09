describe('Code Monkey', function () {
    describe('When played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['code-monkey'],
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'troll']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        describe('next to two logos creatures', function () {
            beforeEach(function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.titanMechanic);
            });

            it('should gain 2 amber', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.helperBot.location).toBe('archives');
                expect(this.titanMechanic.location).toBe('archives');
            });
        });

        describe('next to only one logos creature', function () {
            beforeEach(function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.badPenny);
            });

            it('should not gain 2 amber', function () {
                expect(this.player1.amber).toBe(0);
                expect(this.badPenny.location).toBe('archives');
                expect(this.titanMechanic.location).toBe('archives');
            });
        });

        describe('next to no creatures', function () {
            beforeEach(function () {
                this.player1.moveCard(this.troll, 'hand');
                this.player1.moveCard(this.badPenny, 'hand');
                this.player1.moveCard(this.titanMechanic, 'hand');
                this.player1.moveCard(this.helperBot, 'hand');
                this.player1.playCreature(this.codeMonkey);
            });

            it('should not gain 2 amber', function () {
                expect(this.player1.amber).toBe(0);
            });
        });
    });

    describe('When played with Sinestra and Dexus in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 3,
                    hand: ['code-monkey'],
                    inPlay: ['helper-bot', 'titan-mechanic']
                },
                player2: {
                    inPlay: ['sinestra', 'dexus']
                }
            });
        });

        describe('next to two logos creatures', function () {
            beforeEach(function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.titanMechanic);
                expect(this.helperBot.location).toBe('archives');
                expect(this.titanMechanic.location).toBe('archives');
            });

            it('should gain 2 amber', function () {
                expect(this.player1.amber).toBe(5);
                this.player1.endTurn();
            });
        });
    });
});
