describe('The Grey Rider', function () {
    describe("The Grey Rider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['the-grey-rider', 'inspiration'],
                    inPlay: ['sequis', 'ancient-bear']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
            this.player1.fightWith(this.sequis, this.dextre);
        });

        it('on play, it should allow fighting with an exhausted creature', function () {
            expect(this.sequis.exhausted).toBe(true);
            expect(this.dextre.location).toBe('deck');
            this.player1.playCreature(this.theGreyRider, true);
            this.player1.clickCard(this.theGreyRider);
            expect(this.player1).toHavePrompt('The Grey Rider');
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.theGreyRider);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.sequis.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('on play, it should allow fighting with a non-house creature', function () {
            this.player1.playCreature(this.theGreyRider);
            this.player1.clickCard(this.theGreyRider);
            expect(this.player1).toHavePrompt('The Grey Rider');
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.theGreyRider);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.hasToken('damage')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("on play, it should ready creatures who can't fight", function () {
            this.player1.play(this.inspiration);
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Ancient Bear');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            this.player1.playCreature(this.theGreyRider, true);
            this.player1.clickCard(this.theGreyRider);
            expect(this.player1).toHavePrompt('The Grey Rider');
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("The Grey Rider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['the-grey-rider', 'inspiration'],
                    inPlay: ['sequis']
                },
                player2: {}
            });
        });
        it("on play, it should let you reap with an in house card when there's no opponents to fight", function () {
            this.player1.clickCard(this.sequis);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.sequis.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            this.player1.playCreature(this.theGreyRider, true);
            this.player1.clickCard(this.theGreyRider);
            expect(this.player1).toHavePrompt('The Grey Rider');
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.theGreyRider);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.exhausted).toBe(false);
            this.player1.reap(this.sequis);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(2);
        });
    });
});
