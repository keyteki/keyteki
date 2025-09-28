describe('United Action', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [
                        'lieutenant-khrkhar',
                        'safe-place',
                        'ambassador-liu',
                        'deipno-spymaster'
                    ],
                    hand: [
                        'united-action',
                        'phase-shift',
                        'shadow-self',
                        'armsmaster-molina',
                        'rocket-boots'
                    ]
                },
                player2: {
                    inPlay: ['urchin', 'crash-muldoon'],
                    amber: 3
                }
            });

            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('staralliance');
            this.player1.play(this.unitedAction);
        });

        it('should not allow cards to use used', function () {
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).not.toBeAbleToSelect(this.ambassadorLiu);
            expect(this.player1).not.toBeAbleToSelect(this.deipnoSpymaster);
        });

        it('should allow an in-house card to be played', function () {
            this.player1.play(this.armsmasterMolina);
        });

        it('should allow an out of house card to be played', function () {
            this.player1.play(this.shadowSelf);
        });

        it('should not allow an out of house card that is not represented in play to be played', function () {
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.phaseShift);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'safe-place'],
                    hand: [
                        'united-action',
                        'phase-shift',
                        'shadow-self',
                        'com-officer-kirby',
                        'armsmaster-molina',
                        'diplomat-agung',
                        'rocket-boots'
                    ]
                },
                player2: {
                    inPlay: ['urchin', 'crash-muldoon'],
                    hand: ['big-magnet'],
                    amber: 3
                }
            });
        });

        describe('and an upgrade is attached to a friendly creature', function () {
            beforeEach(function () {
                this.player1.play(this.unitedAction);
                this.player1.play(this.comOfficerKirby);
                this.player1.playUpgrade(this.rocketBoots, this.lieutenantKhrkhar);
            });

            it('should allow an out of house card represented by the upgrade to be played', function () {
                this.player1.play(this.phaseShift);
            });
        });

        describe('and a creature gets a new house', function () {
            beforeEach(function () {
                this.player1.play(this.unitedAction);
                this.player1.play(this.diplomatAgung);
                this.player1.clickPrompt('logos');
                this.player1.clickCard(this.lieutenantKhrkhar);
            });

            it('should allow an out of house card represented by the upgrade to be played', function () {
                this.player1.play(this.phaseShift);
            });
        });

        describe('and an upgrade is attached to an enemy creature', function () {
            beforeEach(function () {
                this.player1.play(this.unitedAction);
                this.player1.play(this.comOfficerKirby);
                this.player1.playUpgrade(this.rocketBoots, this.urchin);
            });

            it('should allow an out of house card represented by the upgrade to be played', function () {
                this.player1.play(this.phaseShift);
            });
        });

        describe('and an upgrade changes controller', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('staralliance');
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
                this.player1.playUpgrade(this.rocketBoots, this.urchin);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.play(this.bigMagnet);
                this.player2.clickCard(this.urchin);
                this.player2.endTurn();
                this.player1.clickPrompt('staralliance');
                this.player1.play(this.unitedAction);
            });

            it('should not allow an out of house card represented by the upgrade to be played', function () {
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                this.player1.clickCard(this.phaseShift);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
