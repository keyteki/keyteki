describe('main phase', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                hand: [
                    'regrowth',
                    'hunting-witch',
                    'way-of-the-bear',
                    'protectrix',
                    'inka-the-spider',
                    'nepenthe-seed'
                ],
                discard: ['ancient-bear'],
                inPlay: ['witch-of-the-eye', 'champion-anaphiel']
            },
            player2: {
                inPlay: ['batdrone']
            }
        });

        this.witchOfTheEye = this.player1.findCardByName('witch-of-the-eye');
        this.championAnaphiel = this.player1.findCardByName('champion-anaphiel');
        this.batdrone = this.player2.findCardByName('batdrone');
        this.ancientBear = this.player1.findCardByName('ancient-bear', 'discard');
    });

    it('should prompt the active player to play cards', function () {
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });

    describe('when the player clicks on a creature of the active house', function () {
        it('should prompt them to reap or fight', function () {
            this.player1.clickCard('witch-of-the-eye');
            expect(this.player1).toHavePrompt('Witch of the Eye');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Cancel');
            expect(this.player1).not.toHavePromptButton("Remove this creature's stun");
            this.player1.clickPrompt('Cancel');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a target if they choose to fight', function () {
            this.player1.clickCard('witch-of-the-eye');
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheEye);
            this.player1.clickCard(this.batdrone);
            expect(this.witchOfTheEye.exhausted).toBe(true);
            expect(this.witchOfTheEye.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
        });

        it('should gain 1 amber if they choose to reap and resolve any reap abilities', function () {
            this.player1.clickCard('witch-of-the-eye');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.witchOfTheEye.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Witch of the Eye');
            this.ancientBear = this.player1.clickCard('ancient-bear', 'discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player1.hand).toContain(this.ancientBear);
        });

        it('should not allow a player to fight or reap but should remove the stun from a stunned creature', function () {
            this.witchOfTheEye.stunned = true;
            this.player1.clickCard('witch-of-the-eye');
            expect(this.player1).toHavePrompt('Witch of the Eye');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton("Remove this creature's stun");
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.witchOfTheEye.exhausted).toBe(true);
            expect(this.witchOfTheEye.stunned).toBe(false);
        });
    });

    describe('when a player clicks a creature of a non-active house', function () {
        it('should prompt the player to play, use or discard a card', function () {
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe('when a player clicks a card of the active house in their hand', function () {
        it('should prompt the player to play or discard that card', function () {
            this.regrowth = this.player1.clickCard('regrowth');
            expect(this.player1).toHavePrompt('Regrowth');
            expect(this.player1).toHavePromptButton('Play this action');
            expect(this.player1).toHavePromptButton('Discard this card');
            expect(this.player1).toHavePromptButton('Cancel');
        });

        it('should discard the card if the player clicks that option', function () {
            this.regrowth = this.player1.clickCard('regrowth');
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.regrowth.location).toBe('discard');
        });

        it('should resolve the action if the player plays an action', function () {
            this.regrowth = this.player1.clickCard('regrowth');
            this.player1.clickPrompt('Play this action');
            expect(this.regrowth.location).toBe('being played');
            expect(this.player1).toHavePrompt('Regrowth');
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.regrowth.location).toBe('discard');
        });

        it('should prompt the player which flank to play a creature on', function () {
            this.inkaTheSpider = this.player1.clickCard('inka-the-spider');
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.player1.player.cardsInPlay[0]).toBe(this.inkaTheSpider);
            expect(this.inkaTheSpider.neighbors).toContain(this.witchOfTheEye);
            expect(this.inkaTheSpider.exhausted).toBe(true);
        });

        it('should resolve any Play: abilities on the creature', function () {
            this.championAnaphiel.stunned = true;
            this.inkaTheSpider = this.player1.clickCard('inka-the-spider');
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Right');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.player1.player.cardsInPlay[2]).toBe(this.inkaTheSpider);
            expect(this.inkaTheSpider.neighbors).toContain(this.championAnaphiel);
            expect(this.inkaTheSpider.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Inka the Spider');
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.batdrone.stunned).toBe(true);
        });

        it("should put the card into play exhuasted if it's an artifact", function () {
            this.nepentheSeed = this.player1.clickCard('nepenthe-seed');
            expect(this.player1).toHavePrompt('Nepenthe Seed');
            expect(this.player1).toHavePromptButton('Play this artifact');
            expect(this.player1).toHavePromptButton('Discard this card');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Play this artifact');
            expect(this.nepentheSeed.location).toBe('play area');
            expect(this.nepentheSeed.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should prompt for a creature to attach to if it's an upgrade", function () {
            this.wayOfTheBear = this.player1.clickCard('way-of-the-bear');
            expect(this.player1).toHavePrompt('Way of the Bear');
            expect(this.player1).toHavePromptButton('Play this upgrade');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePrompt('Choose a creature to attach this upgrade to');
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.championAnaphiel.upgrades).toContain(this.wayOfTheBear);
            expect(this.wayOfTheBear.location).toBe('play area');
            expect(this.wayOfTheBear.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
