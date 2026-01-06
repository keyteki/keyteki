describe('Tide Down', function () {
    describe("Tide Down's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'tide-down',
                        'swift-current',
                        'into-the-abyss',
                        'ascending-jet',
                        'troll'
                    ],
                    discard: [
                        'crushing-tentacle',
                        'grappling-tentacle',
                        'lashing-tentacle',
                        'krump'
                    ]
                },
                player2: {
                    discard: ['dust-pixie']
                }
            });
        });

        it('should allow discarding 0 cards and archiving nothing', function () {
            this.player1.play(this.tideDown);
            expect(this.player1).toHavePrompt('Tide Down');
            this.player1.clickPrompt('Done');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow discarding 1 card and archiving 1 card from discard', function () {
            this.player1.play(this.tideDown);
            expect(this.player1).toHavePrompt('Tide Down');
            expect(this.player1).not.toBeAbleToSelect(this.tideDown);
            expect(this.player1).toBeAbleToSelect(this.swiftCurrent);
            expect(this.player1).toBeAbleToSelect(this.intoTheAbyss);
            expect(this.player1).toBeAbleToSelect(this.ascendingJet);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.lashingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            // Discard 1 cards
            this.player1.clickCard(this.swiftCurrent);
            this.player1.clickPrompt('Done');
            expect(this.swiftCurrent.location).toBe('discard');
            // Archive 1 card from discard
            expect(this.player1).toHavePrompt('Choose a card to archive');
            expect(this.player1).not.toBeAbleToSelect(this.tideDown);
            expect(this.player1).toBeAbleToSelect(this.swiftCurrent);
            expect(this.player1).not.toBeAbleToSelect(this.intoTheAbyss);
            expect(this.player1).not.toBeAbleToSelect(this.ascendingJet);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).toBeAbleToSelect(this.lashingTentacle);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.crushingTentacle);
            expect(this.crushingTentacle.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow discarding 2 cards and archiving 2 cards from discard', function () {
            this.player1.play(this.tideDown);
            expect(this.player1).toHavePrompt('Tide Down');
            // Discard 2 cards
            this.player1.clickCard(this.swiftCurrent);
            this.player1.clickCard(this.intoTheAbyss);
            this.player1.clickPrompt('Done');
            expect(this.swiftCurrent.location).toBe('discard');
            expect(this.intoTheAbyss.location).toBe('discard');
            // Archive 2 cards from discard
            expect(this.player1).toHavePrompt('Choose a card to archive');
            expect(this.player1).not.toBeAbleToSelect(this.tideDown);
            expect(this.player1).toBeAbleToSelect(this.swiftCurrent);
            expect(this.player1).toBeAbleToSelect(this.intoTheAbyss);
            expect(this.player1).not.toBeAbleToSelect(this.ascendingJet);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).toBeAbleToSelect(this.lashingTentacle);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.crushingTentacle);
            expect(this.crushingTentacle.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to archive');
            this.player1.clickCard(this.lashingTentacle);
            expect(this.lashingTentacle.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow discarding 3 cards and archiving 3 cards from discard', function () {
            this.player1.play(this.tideDown);
            expect(this.player1).toHavePrompt('Tide Down');
            // Discard 3 cards
            this.player1.clickCard(this.swiftCurrent);
            this.player1.clickCard(this.intoTheAbyss);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.ascendingJet); // Can't select more than 3, this will do nothing
            this.player1.clickPrompt('Done');
            expect(this.swiftCurrent.location).toBe('discard');
            expect(this.intoTheAbyss.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.ascendingJet.location).toBe('hand');
            // Archive 3 cards from discard
            expect(this.player1).toHavePrompt('Choose a card to archive');
            expect(this.player1).not.toBeAbleToSelect(this.tideDown);
            expect(this.player1).toBeAbleToSelect(this.swiftCurrent);
            expect(this.player1).toBeAbleToSelect(this.intoTheAbyss);
            expect(this.player1).not.toBeAbleToSelect(this.ascendingJet);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).toBeAbleToSelect(this.grapplingTentacle);
            expect(this.player1).toBeAbleToSelect(this.lashingTentacle);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.crushingTentacle);
            expect(this.crushingTentacle.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to archive');
            this.player1.clickCard(this.grapplingTentacle);
            expect(this.grapplingTentacle.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to archive');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow archiving cards that were just discarded', function () {
            this.player1.play(this.tideDown);
            expect(this.player1).toHavePrompt('Tide Down');
            this.player1.clickCard(this.swiftCurrent);
            this.player1.clickPrompt('Done');
            expect(this.swiftCurrent.location).toBe('discard');
            // Archive the card that was just discarded
            expect(this.player1).toHavePrompt('Choose a card to archive');
            expect(this.player1).toBeAbleToSelect(this.swiftCurrent);
            this.player1.clickCard(this.swiftCurrent);
            expect(this.swiftCurrent.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
