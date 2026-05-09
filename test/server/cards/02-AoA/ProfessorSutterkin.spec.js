describe('Professor Sutterkin', function () {
    describe("Professor Sutterkin's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['rocket-boots'],
                    inPlay: ['professor-sutterkin', 'pip-pip', 'troll', 'memory-chip'],
                    deck: ['hunting-witch', 'krump', 'bumpsy', 'flamewake-shaman']
                },
                player2: {
                    inPlay: ['nyzyk-resonator', 'dextre']
                }
            });
        });

        it('draws one card per friendly Logos creature on reap and ignores friendly Logos artifacts/upgrades, non-Logos creatures, and enemy creatures', function () {
            this.player1.playUpgrade(this.rocketBoots, this.pipPip);
            this.player1.reap(this.professorSutterkin);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
