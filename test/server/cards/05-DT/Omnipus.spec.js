describe('Omnipus', function () {
    describe('while in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: [
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'omnipus'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['tentaclid', 'gub', 'tentaclid']
                }
            });
        });

        it('should not be able to fight', function () {
            this.player1.clickCard(this.omnipus);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });

        it('should gain 1A for each friendly Tentaclid when reaping', function () {
            this.player1.reap(this.omnipus);
            expect(this.player1.amber).toBe(9);
            expect(this.player2.amber).toBe(4);
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['hookmaster'],
                    hand: ['omnipus'],
                    discard: [
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'badgemagus',
                        'tentaclid',
                        'tentaclid',
                        'tentaclid',
                        'the-grey-rider',
                        'gub',
                        'shooler',
                        'tentaclid'
                    ]
                },
                player2: {
                    amber: 4
                }
            });

            for (let i = this.player1.discard.length - 1; i >= 1; --i) {
                this.player1.moveCard(this.player1.discard[i], 'deck');
            }

            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.discard.filter((c) => c.id === 'tentaclid').length).toBe(1);

            this.player1.play(this.omnipus);
        });

        it('should discard 8 cards', function () {
            expect(this.player1.player.discard.length).toBe(9);
            expect(this.player1.player.discard.filter((c) => c.id === 'tentaclid').length).toBe(6);
        });

        it('should play each tentclid in discard pile', function () {
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.discard.length).toBe(8);
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.discard.length).toBe(7);
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.discard.length).toBe(5);
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.discard.length).toBe(4);
            expect(this.player1).toHavePrompt('Tentaclid');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.badgemagus.location).toBe('discard');
            expect(this.theGreyRider.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.shooler.location).toBe('deck');
            expect(this.player1.player.deck.filter((c) => c.id === 'tentaclid').length).toBe(1);
            expect(
                this.player1.player.creaturesInPlay.filter((c) => c.id === 'tentaclid').length
            ).toBe(6);
            this.player1.endTurn();
        });
    });
});
