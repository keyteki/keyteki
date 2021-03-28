describe("Nature's Call", function () {
    describe("Nature's Call ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['nature-s-call'],
                    inPlay: ['urchin', 'nexus']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should be able to play without picking any creatures', function () {
            this.player1.play(this.natureSCall);
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
        });

        it('should be able to play with only picking 1 creature', function () {
            this.player1.play(this.natureSCall);
            expect(this.player1.currentButtons).toContain('Done');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.nexus);
            this.player1.clickPrompt('Done');
            expect(this.nexus.location).toBe('hand');
        });

        it('should be able to play with only picking 3 creatures from each side', function () {
            this.player1.play(this.natureSCall);
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickCard(this.nexus);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Done');
            expect(this.nexus.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.mother.location).toBe('hand');
        });

        it('should not be able return more than 3', function () {
            this.player1.play(this.natureSCall);
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickCard(this.nexus);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.nexus.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.mother.location).toBe('hand');
            expect(this.zorg.location).toBe('play area');
        });
    });
});
