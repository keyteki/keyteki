describe('Selective Preservation', function () {
    describe("Selective Preservation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['selective-preservation', 'scout-pete', 'chief-engineer-walls'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    hand: ['bingle-bangbang', 'flamewake-shaman'],
                    inPlay: []
                }
            });
        });

        it('should play cleanly with no board', function () {
            this.player1.play(this.selectivePreservation);
            this.player1.endTurn();
        });

        it('should play with one creture and leave it unharmed', function () {
            this.player1.moveCard(this.scoutPete, 'play area');
            expect(this.scoutPete.location).toBe('play area');
            this.player1.play(this.selectivePreservation);
            this.player1.endTurn();
            expect(this.scoutPete.location).toBe('play area');
        });

        it('should play with two creatures with same power and only kill 1', function () {
            this.player1.moveCard(this.scoutPete, 'play area');
            this.player2.moveCard(this.flamewakeShaman, 'play area');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.flamewakeShaman.location).toBe('play area');

            this.player1.play(this.selectivePreservation);

            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.flamewakeShaman);
            this.player1.clickCard(this.scoutPete);

            this.player1.endTurn();
            expect(this.scoutPete.location).toBe('play area');
            expect(this.flamewakeShaman.location).toBe('discard');
        });

        it('should play with two sets of power and leave 1 creature from each power set alive', function () {
            this.player1.moveCard(this.scoutPete, 'play area');
            this.player2.moveCard(this.flamewakeShaman, 'play area');
            this.player1.moveCard(this.chiefEngineerWalls, 'play area');
            this.player2.moveCard(this.bingleBangbang, 'play area');

            expect(this.scoutPete.location).toBe('play area');
            expect(this.flamewakeShaman.location).toBe('play area');
            expect(this.chiefEngineerWalls.location).toBe('play area');
            expect(this.bingleBangbang.location).toBe('play area');

            this.player1.play(this.selectivePreservation);

            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.flamewakeShaman);
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.bingleBangbang);
            this.player1.clickCard(this.scoutPete);
            this.player1.clickCard(this.bingleBangbang);
            this.player1.clickPrompt('Done');

            this.player1.endTurn();
            expect(this.scoutPete.location).toBe('play area');
            expect(this.bingleBangbang.location).toBe('play area');
            expect(this.chiefEngineerWalls.location).toBe('discard');
            expect(this.flamewakeShaman.location).toBe('discard');
        });

        it('should play with two creatures with same power and only kill 1 - with power tokens', function () {
            this.player1.moveCard(this.scoutPete, 'play area');
            this.player2.moveCard(this.bingleBangbang, 'play area');
            expect(this.scoutPete.location).toBe('play area');
            expect(this.bingleBangbang.location).toBe('play area');
            this.bingleBangbang.addToken('power');
            this.bingleBangbang.addToken('power');

            this.player1.play(this.selectivePreservation);

            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.bingleBangbang);
            this.player1.clickCard(this.scoutPete);

            this.player1.endTurn();
            expect(this.scoutPete.location).toBe('play area');
            expect(this.bingleBangbang.location).toBe('discard');
        });
    });
});
