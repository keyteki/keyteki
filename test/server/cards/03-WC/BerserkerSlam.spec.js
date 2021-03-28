describe('Berserker Slam', function () {
    describe('Play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    hand: ['berserker-slam'],
                    inPlay: ['forgemaster-og', 'bingle-bangbang', 'troll']
                },
                player2: {
                    amber: 4,
                    hand: ['exile'],
                    inPlay: ['nexus', 'urchin', 'dodger']
                }
            });
        });

        it('cannot target non-flank creatures', function () {
            this.player1.play(this.berserkerSlam);
            expect(this.player1).toBeAbleToSelect(this.forgemasterOg);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });

        it('makes self lose 1 amber if destroy own flank creature', function () {
            this.player1.play(this.berserkerSlam);
            expect(this.player1).toBeAbleToSelect(this.forgemasterOg);
            expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.forgemasterOg);
            expect(this.forgemasterOg.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Berserker Slam to cause player1 to lose 1 amber'
            );
        });

        it('makes opponent lose 1 amber if destroy opponents flank creature', function () {
            this.player1.play(this.berserkerSlam);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Berserker Slam to cause player2 to lose 1 amber'
            );
        });

        it('doesnt lose our amber if doesnt destroy our flank creature', function () {
            this.player1.play(this.berserkerSlam);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
        });

        it('doesnt lose opponents amber if doesnt destroy opponents flank creature', function () {
            this.player1.play(this.berserkerSlam);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.dodger);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.dodger.tokens.damage).toBe(4);
        });

        it('should remove amber from controller and not owner', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.exile);
            this.player2.clickCard(this.urchin);
            this.player2.clickPrompt('Right');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.berserkerSlam);
            this.player1.clickCard(this.urchin);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Berserker Slam to cause player1 to lose 1 amber'
            );
            expect(this.urchin.location).toBe('discard');
        });
    });
});
