describe('Grand Alliance Council', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['grand-alliance-council', 'stealthster', 'dust-pixie', 'dharna'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    hand: ['scout-pete', 'subject-kirby'],
                    inPlay: []
                }
            });
        });

        it('should exit cleanly when no creatures are on board', function () {
            this.player1.play(this.grandAllianceCouncil);
            this.player1.endTurn();
        });

        xit('should prompt to not kill a single creature to not kill and leave them alive', function () {
            this.player1.play(this.stealthster);
            this.player1.play(this.grandAllianceCouncil);
            expect(this.player1).toHavePrompt('Choose a Star Alliance creature to not destroy');
            this.player1.clickCard(this.stealthster);
            this.player1.endTurn();
            expect(this.stealthster.location).toBe('play area');
        });

        it('should prompt to not kill a single creature and kill the rest', function () {
            this.player1.moveCard(this.stealthster, 'play area');
            this.player2.moveCard(this.scoutPete, 'play area');
            this.player2.moveCard(this.subjectKirby, 'play area');

            expect(this.stealthster.location).toBe('play area');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.subjectKirby.location).toBe('play area');

            this.player1.play(this.grandAllianceCouncil);

            expect(this.player1).toBeAbleToSelect(this.stealthster);
            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.subjectKirby);
            expect(this.player1).toHavePrompt('Choose a Star Alliance creature to not destroy');
            this.player1.clickCard(this.scoutPete);

            this.player1.endTurn();
            expect(this.stealthster.location).toBe('discard');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.subjectKirby.location).toBe('discard');
        });

        it('should prompt to not kill a single creature and kill the rest for 2 houses in play', function () {
            this.player1.moveCard(this.dharna, 'play area');
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.moveCard(this.stealthster, 'play area');
            this.player2.moveCard(this.scoutPete, 'play area');
            this.player2.moveCard(this.subjectKirby, 'play area');

            expect(this.dharna.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.stealthster.location).toBe('play area');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.subjectKirby.location).toBe('play area');

            this.player1.play(this.grandAllianceCouncil);

            expect(this.player1).toBeAbleToSelect(this.stealthster);
            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.subjectKirby);
            expect(this.player1).toHavePrompt('Choose a Star Alliance creature to not destroy');
            this.player1.clickCard(this.scoutPete);

            expect(this.player1).toBeAbleToSelect(this.dharna);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a Untamed creature to not destroy');
            this.player1.clickCard(this.dharna);

            this.player1.endTurn();
            expect(this.dharna.location).toBe('play area');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.stealthster.location).toBe('discard');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.subjectKirby.location).toBe('discard');
        });
    });
});
