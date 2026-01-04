describe('Spontaneous Awakening', function () {
    describe("Spontaneous Awakening's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['spontaneous-awakening'],
                    inPlay: ['miss-chievous', 'ritual-of-balance']
                },
                player2: {
                    amber: 4,
                    hand: ['wipe-clear'],
                    inPlay: [
                        'library-of-babble',
                        'mother',
                        'old-egad',
                        'faust-the-great',
                        'dust-pixie'
                    ],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('does nothing when opponent is not haunted', function () {
            this.player1.play(this.spontaneousAwakening);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when opponent is haunted', function () {
            beforeEach(function () {
                this.player1.fightWith(this.missChievous, this.dustPixie);
                this.player1.play(this.spontaneousAwakening);
            });

            it('can destroy an enemy cyborg and play it', function () {
                expect(this.player1).toBeAbleToSelect(this.oldEgad);
                expect(this.player1).toBeAbleToSelect(this.mother);
                expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
                expect(this.player1).not.toBeAbleToSelect(this.missChievous);
                expect(this.player1).not.toBeAbleToSelect(this.ritualOfBalance);
                expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
                this.player1.clickCard(this.oldEgad);
                this.player1.clickPrompt('Right');
                expect(this.oldEgad.location).toBe('play area');
                expect(this.player1.player.creaturesInPlay).toContain(this.oldEgad);
                expect(this.spontaneousAwakening.type).toBe('upgrade');
                expect(this.oldEgad.upgrades).toContain(this.spontaneousAwakening);
                expect(this.spontaneousAwakening.parent).toBe(this.oldEgad);
                expect(this.mother.tokens.ward).toBe(1);
                expect(this.faustTheGreat.tokens.ward).toBe(1);
                expect(this.oldEgad.exhausted).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });

            it('can destroy an enemy robot and play it', function () {
                this.player1.clickCard(this.mother);
                this.player1.clickPrompt('Right');
                expect(this.mother.location).toBe('play area');
                expect(this.player1.player.creaturesInPlay).toContain(this.mother);
                expect(this.spontaneousAwakening.type).toBe('upgrade');
                expect(this.mother.upgrades).toContain(this.spontaneousAwakening);
                expect(this.spontaneousAwakening.parent).toBe(this.mother);
                expect(this.mother.exhausted).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });

            it('can destroy an enemy artifact and play it', function () {
                this.player1.clickCard(this.libraryOfBabble);
                expect(this.libraryOfBabble.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).toContain(this.libraryOfBabble);
                expect(this.spontaneousAwakening.type).toBe('upgrade');
                expect(this.libraryOfBabble.upgrades).toContain(this.spontaneousAwakening);
                expect(this.spontaneousAwakening.parent).toBe(this.libraryOfBabble);
                expect(this.libraryOfBabble.exhausted).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });

            it('can make the enemy artifact geistoid', function () {
                this.player1.clickCard(this.libraryOfBabble);
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                expect(this.player1).not.toHavePrompt('logos');
                this.player1.clickPrompt('geistoid');
                let p1hand = this.player1.player.hand.length;
                this.player1.useAction(this.libraryOfBabble);
                expect(this.player1.player.hand.length).toBe(p1hand + 1);
                expect(this.player1).isReadyToTakeAction();
            });

            it('card stays in play when upgrade is gone, but no longer geistoid', function () {
                this.player1.clickCard(this.mother);
                this.player1.clickPrompt('Right');
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.play(this.wipeClear);
                expect(this.spontaneousAwakening.location).toBe('discard');
                expect(this.spontaneousAwakening.type).toBe('action');
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
                this.player1.reap(this.mother);
                expect(this.player1.amber).toBe(3);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
