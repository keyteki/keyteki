describe('WretchedDoll', function () {
    describe('Wretched Doll place doom counters', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 0,
                    inPlay: ['wretched-doll', 'zorg'],
                    hand: ['bad-penny']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: []
                }
            });
        });

        it('can place doom counter and destroy doomed creature for on both sides', function () {
            this.player1.useAction(this.wretchedDoll);
            expect(this.player1).toHavePrompt('Wretched Doll');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedDoll);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.mightyTiger.hasToken('doom')).toBe(false);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.tokens.doom).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.useAction(this.wretchedDoll);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.zorg.location).toBe('play area');
            expect(this.wretchedDoll.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.useAction(this.wretchedDoll);
            this.player1.clickCard(this.zorg);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.useAction(this.wretchedDoll);
            expect(this.zorg.location).toBe('discard');
        });
    });
});
