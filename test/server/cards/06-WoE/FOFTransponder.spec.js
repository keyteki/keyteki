describe('FOF Transponder', function () {
    describe("FOF Transponder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    token: 'b0-t',
                    house: 'staralliance',
                    inPlay: ['helmsman-spears'],
                    hand: ['fof-transponder', 'fof-transponder', 'particle-sweep']
                },
                player2: {
                    token: 'grumpus',
                    inPlay: ['bumpsy'],
                    hand: ['autocannon']
                }
            });

            this.fofTransponder2 = this.player1.hand[1];
        });

        it('should move to new token creature when parent is destroyed', function () {
            this.player1.playUpgrade(this.fofTransponder, this.helmsmanSpears);
            this.player1.play(this.particleSweep);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickPrompt('Right');
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.fofTransponder.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            let token = this.player1.player.creaturesInPlay[0];
            expect(token.upgrades).toContain(this.fofTransponder);
        });

        it('should work on opponents turn', function () {
            this.player1.playUpgrade(this.fofTransponder, this.helmsmanSpears);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.helmsmanSpears);
            this.player2.clickPrompt('Right');
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.fofTransponder.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            let token = this.player1.player.creaturesInPlay[0];
            expect(token.upgrades).toContain(this.fofTransponder);
        });

        it('should stack', function () {
            this.player1.playUpgrade(this.fofTransponder, this.helmsmanSpears);
            this.player1.playUpgrade(this.fofTransponder2, this.helmsmanSpears);
            this.player1.play(this.particleSweep);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.fofTransponder.location).toBe('play area');
            expect(this.fofTransponder2.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            let token1 = this.player1.player.creaturesInPlay[0];
            let token2 = this.player1.player.creaturesInPlay[1];
            expect(token1.upgrades).toContain(this.fofTransponder);
            expect(token2.upgrades).toContain(this.fofTransponder2);
        });

        it('should not work if token immediately dies', function () {
            this.player1.playUpgrade(this.fofTransponder, this.helmsmanSpears);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.autocannon);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.particleSweep);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickPrompt('Right');
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.fofTransponder.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
        });
    });
});
