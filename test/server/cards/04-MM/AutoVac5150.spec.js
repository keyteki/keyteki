describe('Auto-Vac 5150', function () {
    describe("Auto-Vac 5150's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'logos',
                    inPlay: ['auto-vac-5150', 'dextre'],
                    archives: ['groke', 'mother'],
                    hand: ['lumilu', 'dust-pixie']
                },
                player2: {
                    amber: 6,
                    inPlay: ['munchling', 'keyfrog'],
                    hand: ['remote-access', 'drumble'],
                    archives: ['daughter']
                }
            });
        });

        it('should stop a key being forged after discarding an archived card', function () {
            this.player1.clickCard(this.autoVac5150);
            this.player1.clickPrompt("Use this card's Action ability");

            expect(this.player1).toHavePrompt(
                'Discard a card from your archives or archive a card'
            );
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.lumilu);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.autoVac5150);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.groke);
            this.player1.endTurn();

            expect(this.groke.location).toBe('discard');
            expect(this.mother.location).toBe('archives');

            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });

        xit('should not increase opponents key cost on the current turn, allowing them to forge with keyfrog', function () {
            this.player1.clickCard(this.autoVac5150);
            this.player1.clickPrompt("Use this card's Action ability");

            expect(this.player1).toHavePrompt(
                'Discard a card from your archives or archive a card'
            );
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.lumilu);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.autoVac5150);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.groke);
            this.player1.fightWith(this.dextre, this.keyfrog);

            expect(this.player1).toHavePrompt('Forge a Key');
            expect(this.player1).clickPrompt('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should allow a key to be forged for +3', function () {
            this.player2.amber = 10;
            this.player1.clickCard(this.autoVac5150);
            this.player1.clickPrompt("Use this card's Action ability");

            expect(this.player1).toHavePrompt(
                'Discard a card from your archives or archive a card'
            );
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.lumilu);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.autoVac5150);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.groke);
            this.player1.endTurn();

            expect(this.groke.location).toBe('discard');
            expect(this.mother.location).toBe('archives');

            expect(this.player2).toHavePrompt('Forge a Key');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(1);
        });

        it('should not stop a key being forged after archiving a card', function () {
            this.player1.clickCard(this.autoVac5150);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.lumilu);
            this.player1.endTurn();

            expect(this.lumilu.location).toBe('archives');

            expect(this.player2).toHavePrompt('Forge a Key');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should work with remote access after discarding an archived card', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');

            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.autoVac5150);

            expect(this.player2).toHavePrompt(
                'Discard a card from your archives or archive a card'
            );
            expect(this.player2).toBeAbleToSelect(this.daughter);
            expect(this.player2).toBeAbleToSelect(this.drumble);
            expect(this.player2).not.toBeAbleToSelect(this.munchling);
            expect(this.player2).not.toHavePromptButton('Done');
            this.player2.clickCard(this.daughter);
            this.player2.endTurn();

            expect(this.daughter.location).toBe('discard');

            expect(this.player1).not.toHavePrompt('Forge a Key');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.player.amber).toBe(6);
        });

        it('should work with remote access after archiving a card', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');

            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.autoVac5150);
            this.player2.clickCard(this.drumble);
            this.player2.endTurn();

            expect(this.drumble.location).toBe('archives');

            expect(this.player1).toHavePrompt('Forge a Key');
            this.player1.forgeKey('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.amber).toBe(0);
        });

        it('should not stop a key being forged when archives are empty', function () {
            this.player1.moveCard(this.groke, 'discard');
            this.player1.moveCard(this.mother, 'discard');
            this.player1.moveCard(this.lumilu, 'discard');
            this.player1.moveCard(this.dustPixie, 'discard');

            this.player1.clickCard(this.autoVac5150);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.endTurn();

            expect(this.player2).toHavePrompt('Forge a Key');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });
    });
});
