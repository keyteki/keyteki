describe('Thin The Herd', function () {
    describe("Thin The Herd's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['thin-the-herd'],
                    inPlay: ['flaxia', 'urchin', 'nexus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie', 'krump']
                }
            });
        });

        it('should destroy the 4 least powerful creatures.', function () {
            this.player1.play(this.thinTheHerd);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.nexus);

            this.player1.clickCard(this.dustPixie);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.urchin);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.nexus);
            this.player1.clickPrompt('Done');

            expect(this.dustPixie.location).not.toBe('play area');
            expect(this.urchin.location).not.toBe('play area');
            expect(this.flaxia.location).not.toBe('play area');
            expect(this.nexus.location).not.toBe('play area');
            expect(this.dustPixie.location).not.toBe('discard');
            expect(this.urchin.location).not.toBe('discard');
            expect(this.flaxia.location).not.toBe('discard');
            expect(this.nexus.location).not.toBe('discard');

            expect(this.krump.location).toBe('play area');
        });
    });
});
