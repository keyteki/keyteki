describe('Scowly Caper', function () {
    describe("Scowly Caper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lamindra', 'nexus', 'yantzee-gang', 'spangler-box'],
                    hand: ['scowly-caper']
                },
                player2: {
                    inPlay: ['archimedes', 'dextre', 'faygin', 'gorm-of-omm'],
                    hand: ['relentless-whispers']
                }
            });
        });

        it("should start at opponent's play area", function () {
            this.player1.playCreature(this.scowlyCaper);

            // Should not ask for flank positioning twice
            expect(this.player1).not.toHavePrompt('Scowly Caper');

            expect(this.scowlyCaper.location).toBe('play area');

            expect(this.player1.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInPlay).toContain(this.scowlyCaper);

            expect(this.scowlyCaper.controller).toBe(this.player2.player);
        });

        it('should select creature to destroy at end of turn', function () {
            this.player1.playCreature(this.scowlyCaper);
            this.player1.endTurn();

            expect(this.player1.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInPlay).toContain(this.scowlyCaper);

            expect(this.player2).toHavePromptButton('shadows');
            this.player2.clickPrompt('shadows');
            expect(this.scowlyCaper.exhausted).toBe(true);
            this.player2.endTurn();

            expect(this.player2).toHavePrompt('Scowly Caper');
            expect(this.player2).toBeAbleToSelect(this.faygin);
            expect(this.player2).not.toBeAbleToSelect(this.archimedes);
            expect(this.player2).not.toBeAbleToSelect(this.dextre);
            this.player2.clickCard(this.faygin);

            expect(this.faygin.location).toBe('discard');
        });

        it('should return to its owners discard', function () {
            this.player1.playCreature(this.scowlyCaper);
            this.player1.endTurn();

            expect(this.player2).toHavePromptButton('shadows');
            this.player2.clickPrompt('shadows');
            this.player2.play(this.relentlessWhispers);
            this.player2.clickCard(this.scowlyCaper);

            expect(this.player2.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.scowlyCaper.location).toBe('discard');
            expect(this.player1.discard).toContain(this.scowlyCaper);
            expect(this.player2.discard).not.toContain(this.scowlyCaper);
        });

        it("should be archived in owner's archive if next to archimedes", function () {
            this.player1.playCreature(this.scowlyCaper, true);
            this.player1.endTurn();

            expect(this.player2).toHavePromptButton('shadows');
            this.player2.clickPrompt('shadows');
            this.player2.play(this.relentlessWhispers);
            this.player2.clickCard(this.scowlyCaper);

            expect(this.player1.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInPlay).not.toContain(this.scowlyCaper);

            expect(this.player1.player.cardsInHand).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInHand).not.toContain(this.scowlyCaper);

            expect(this.scowlyCaper.location).toBe('archives');
            expect(this.player1.archives).toContain(this.scowlyCaper);
            expect(this.player2.archives).not.toContain(this.scowlyCaper);
        });

        it("should return to its owner's opponent play area after Spangler is destroyed", function () {
            this.player1.playCreature(this.scowlyCaper);
            this.player1.endTurn();

            expect(this.player1.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInPlay).toContain(this.scowlyCaper);

            expect(this.player2).toHavePromptButton('shadows');
            this.player2.clickPrompt('shadows');
            expect(this.scowlyCaper.exhausted).toBe(true);
            this.player2.endTurn();

            this.player2.clickCard(this.faygin);

            expect(this.player1).toHavePromptButton('logos');
            this.player1.clickPrompt('logos');

            this.player1.clickCard(this.spanglerBox);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.scowlyCaper);
            expect(this.scowlyCaper.location).toBe('purged');
            this.player1.endTurn();

            expect(this.player2).toHavePromptButton('sanctum');
            this.player2.clickPrompt('sanctum');
            this.player2.clickCard(this.gormOfOmm);
            this.player2.clickPrompt("Use this card's Omni ability");
            this.player2.clickCard(this.spanglerBox);

            expect(this.player2).toHavePrompt('Scowly Caper');
            this.player2.clickPrompt('Left');
            expect(this.scowlyCaper.location).toBe('play area');

            expect(this.scowlyCaper.controller).toBe(this.player2.player);
            expect(this.player1.player.cardsInPlay).not.toContain(this.scowlyCaper);
            expect(this.player2.player.cardsInPlay).toContain(this.scowlyCaper);
            expect(this.scowlyCaper.exhausted).toBe(true);

            expect(this.spanglerBox.location).toBe('discard');

            this.player2.endTurn();

            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).not.toBeAbleToSelect(this.dextre);
            this.player2.clickCard(this.archimedes);

            expect(this.archimedes.location).toBe('discard');
        });

        it('opponent should be able to use it regardless of house chosen', function () {
            this.player1.playCreature(this.scowlyCaper);
            this.scowlyCaper.exhausted = false;
            expect(this.scowlyCaper.controller).toBe(this.player2.player);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.scowlyCaper, this.yantzeeGang);
            expect(this.scowlyCaper.location).toBe('play area');
            expect(this.scowlyCaper.hasToken('damage')).toBe(false);
            expect(this.yantzeeGang.tokens.damage).toBe(2);
        });
    });
});
