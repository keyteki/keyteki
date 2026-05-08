describe('Tangrant', function () {
    describe("Tangrant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['tangrant', 'martian-propagandist'],
                    hand: [
                        'phase-shift',
                        'glylyx-weaponsmith',
                        'ether-spider',
                        'virtuous-works',
                        'commander-remiel'
                    ]
                },
                player2: {}
            });
        });

        it('should allow playing a Mars card', function () {
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow playing a house enhanced Mars card', function () {
            this.virtuousWorks.enhancements = ['mars'];
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.etherSpider);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stack with Phase Shift', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            expect(this.virtuousWorks.location).toBe('discard');
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should not be consumed if effect changes played creature's house", function () {
            this.martianPropagandist.enhancements = ['sanctum'];
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.reap(this.martianPropagandist);
            // Tangrant's allowance checks from hand, before Propagandist changes house to Mars on play
            this.player1.playCreature(this.commanderRemiel);
            this.player1.playCreature(this.etherSpider);
            expect(this.etherSpider.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
