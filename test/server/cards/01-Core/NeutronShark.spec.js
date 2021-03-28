describe('Neutron Shark', function () {
    describe("Neutron Shark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neutron-shark', 'twin-bolt-emission'],
                    inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble'],
                    discard: ['dextre', 'urchin', 'umbra']
                },
                player2: {
                    inPlay: ['batdrone', 'ember-imp']
                }
            });
        });

        it('should trigger when played', function () {
            this.player1.play(this.neutronShark);
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
        });

        it('should destroy both cards and discard the top card of the deck', function () {
            this.player1.moveCard(this.dextre, 'deck');
            expect(this.dextre.location).toBe('deck');
            this.player1.play(this.neutronShark);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.dextre.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should resolve the ability again if the top card is not logos', function () {
            this.player1.moveCard(this.dextre, 'deck');
            expect(this.dextre.location).toBe('deck');
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            expect(this.urchin.location).toBe('deck');
            expect(this.umbra.location).toBe('deck');
            this.player1.play(this.neutronShark);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.nexus);
            expect(this.emberImp.location).toBe('discard');
            expect(this.nexus.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.dextre.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should repeat even if only one card was destroyed', function () {
            this.player1.play(this.twinBoltEmission);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Done');
            expect(this.emberImp.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.play(this.neutronShark);
            expect(this.player1).toHavePrompt('Neutron Shark');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.nexus);
            expect(this.umbra.location).toBe('discard');
            expect(this.nexus.location).toBe('discard');
            expect(this.player1).toHavePrompt('Neutron Shark');
        });

        it('should not repeat if Neutron Shark was destroyed', function () {
            this.player1.moveCard(this.umbra, 'deck');
            expect(this.umbra.location).toBe('deck');
            this.player1.play(this.neutronShark);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.neutronShark);
            expect(this.emberImp.location).toBe('discard');
            expect(this.neutronShark.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe('Neutron Shark and Bellowing Patrizate interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neutron-shark', 'twin-bolt-emission'],
                    inPlay: ['bellowing-patrizate'],
                    discard: ['dextre', 'urchin', 'umbra']
                }
            });
        });

        it('should prompt the player to choose which to resolve first', function () {
            this.player1.play(this.neutronShark);
            expect(this.player1).toHavePrompt('Triggered Abilities');
        });
    });
});
