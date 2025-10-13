describe('Lash of Broken Dreams', function () {
    describe("Lash of Broken Dreams's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams', 'shooler'],
                    hand: ['collar-of-subordination']
                },
                player2: {
                    amber: 6,
                    inPlay: ['keyfrog'],
                    hand: ['remote-access', 'krrrzzzaaap']
                }
            });
        });

        it('should stop a key being forged', function () {
            this.player1.useAction(this.lashOfBrokenDreams);
            this.player1.endTurn();

            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });

        it('should not stop a key being forged on the turn it was played', function () {
            this.player1.useAction(this.lashOfBrokenDreams);
            this.player1.fightWith(this.shooler, this.keyfrog);
            this.player1.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
            this.player1.endTurn();
        });

        it('should stop controller from forging a key', function () {
            this.player1.useAction(this.lashOfBrokenDreams);
            this.player1.playUpgrade(this.collarOfSubordination, this.keyfrog);
            this.player1.clickPrompt('Left');
            expect(this.keyfrog.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player1.amber = 6;
            this.player2.clickPrompt('logos');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
            this.player2.play(this.krrrzzzaaap);
            this.player2.endTurn();
        });

        it('should work with Remote Access', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.lashOfBrokenDreams);
            this.player2.endTurn();

            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.player.amber).toBe(6);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'lash-of-broken-dreams']
                },
                player2: {
                    amber: 9,
                    inPlay: ['ember-imp'],
                    hand: ['necromorph', 'azuretooth', 'shaffles']
                }
            });
            this.tachyonManifold.maverick = 'dis';
            this.tachyonManifold.printedHouse = 'dis';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.useAction(this.lashOfBrokenDreams);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('dis');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
