describe('Shield-U-Later', function () {
    describe("Shield-U-Later's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: [
                        'armsmaster-molina',
                        'bulwark',
                        'operations-officer-yshi',
                        'scout-pete'
                    ],
                    hand: ['shield-u-later']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('can be played as a creature', function () {
            this.player1.play(this.shieldULater);
            expect(this.shieldULater.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be played as an upgrade', function () {
            this.player1.playUpgrade(this.shieldULater, this.scoutPete);
            expect(this.scoutPete.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can cancel upgrade attachment selection and return to hand', function () {
            this.player1.clickCard(this.shieldULater);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePrompt('Choose a creature to attach this upgrade to');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.shieldULater.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Shield-U-Later cancel and Corrode interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['scout-pete'],
                    hand: ['shield-u-later']
                },
                player2: {
                    house: 'unfathomable',
                    hand: ['corrode']
                }
            });
        });

        it('cannot be targeted by Corrode as upgrade after cancelling upgrade play', function () {
            this.player1.clickCard(this.shieldULater);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.shieldULater.location).toBe('hand');
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.corrode);
            // Corrode should not prompt - there's nothing to destroy
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot be targeted by Corrode as creature with armor after cancelling creature play', function () {
            this.player1.clickCard(this.shieldULater);
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.shieldULater.location).toBe('hand');
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.corrode);
            // Corrode should not prompt - there's nothing to destroy
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
