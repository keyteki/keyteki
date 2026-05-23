describe('Starpatch', function () {
    describe("Starpatch's gained start-of-turn ability with a shared-house enemy creature", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['starpatch'],
                    inPlay: ['paranormal-palisade']
                },
                player2: {
                    inPlay: ['fading-apparition', 'urchin']
                }
            });
        });

        it('purges a shared-house enemy creature when the upgraded creature is exhausted at the start of the turn', function () {
            this.player1.playUpgrade(this.starpatch, this.paranormalPalisade);
            this.paranormalPalisade.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.paranormalPalisade);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.fadingApparition);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.paranormalPalisade);
            this.player1.clickCard(this.fadingApparition);
            expect(this.fadingApparition.location).toBe('purged');
            expect(this.urchin.location).toBe('play area');
            expect(this.paranormalPalisade.location).toBe('play area');
            this.player1.clickPrompt('unfathomable');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Starpatch when the upgraded creature is ready at the start of the turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['starpatch'],
                    inPlay: ['paranormal-palisade']
                },
                player2: {
                    inPlay: ['fading-apparition']
                }
            });
        });

        it('does not trigger', function () {
            this.player1.playUpgrade(this.starpatch, this.paranormalPalisade);
            this.player1.endTurn();
            this.player2.clickPrompt('geistoid');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.fadingApparition.location).toBe('play area');
            expect(this.paranormalPalisade.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Starpatch with no other shared-house creature in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['starpatch'],
                    inPlay: ['paranormal-palisade']
                },
                player2: {
                    inPlay: ['urchin', 'troll']
                }
            });
        });

        it('does not trigger when nothing else shares a house', function () {
            this.player1.playUpgrade(this.starpatch, this.paranormalPalisade);
            this.paranormalPalisade.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.paranormalPalisade);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.urchin.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.paranormalPalisade.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Starpatch when only a friendly creature shares a house', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['starpatch'],
                    inPlay: ['paranormal-palisade', 'jahneerie']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('forces the controller to purge the friendly creature', function () {
            this.player1.playUpgrade(this.starpatch, this.paranormalPalisade);
            this.paranormalPalisade.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.paranormalPalisade);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.jahneerie);
            expect(this.player1).not.toBeAbleToSelect(this.paranormalPalisade);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.jahneerie);
            expect(this.jahneerie.location).toBe('purged');
            expect(this.paranormalPalisade.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            this.player1.clickPrompt('unfathomable');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Starpatch on the opponent's turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['starpatch'],
                    inPlay: ['paranormal-palisade', 'jahneerie']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('does not trigger on the opponents turn', function () {
            this.player1.playUpgrade(this.starpatch, this.paranormalPalisade);
            this.paranormalPalisade.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            expect(this.jahneerie.location).toBe('play area');
            expect(this.paranormalPalisade.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
        });
    });
});
