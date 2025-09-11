describe('Portalmonster', function () {
    describe("Portalmonster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 30,
                    house: 'logos',
                    hand: ['opposition-research', 'dimension-door', 'data-forge'],
                    inPlay: ['portalmonster'],
                    discard: new Array(8).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 30,
                    hand: ['key-charge'],
                    inPlay: ['thing-from-the-deep', 'keyfrog']
                }
            });
            this.player1.chains = 36;
        });

        it('makes keys cost -2 when not haunted', function () {
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(19); // 1+30-(6+10-2-2)
            this.player1.fightWith(this.portalmonster, this.keyfrog);
            this.player1.forgeKey('red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.amber).toBe(26); // 30-(6-2)
        });

        it('makes keys cost +1 per discard card when haunted', function () {
            this.player1.play(this.oppositionResearch);
            this.player1.play(this.dimensionDoor);
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(5); // 1+30-(6+10+10)
            this.player1.fightWith(this.portalmonster, this.keyfrog);
            this.player1.forgeKey('red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.amber).toBe(13); // 30-(6+11)
        });

        it('does not archive on destroy if not haunted', function () {
            this.player1.fightWith(this.portalmonster, this.thingFromTheDeep);
            expect(this.portalmonster.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('archives on destroy if haunted', function () {
            this.player1.play(this.oppositionResearch);
            this.player1.play(this.dimensionDoor);
            this.player1.fightWith(this.portalmonster, this.thingFromTheDeep);
            expect(this.portalmonster.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
