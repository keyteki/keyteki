describe('Mimic Gel', function () {
    describe("Mimic Gel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'batdrone',
                        'key-to-dis',
                        'tantadlin',
                        'titan-guardian',
                        'xenos-bloodshadow'
                    ],
                    hand: ['mimic-gel', 'phase-shift', 'dextre']
                },
                player2: {
                    inPlay: ['panpaca-anga', 'flaxia', 'duskwitch', 'bumblebird', 'troll']
                }
            });
        });

        it('should not allow Mimic Gel to be played if there are no creatures in play', function () {
            this.player1.useAction(this.keyToDis, true);
            expect(this.batdrone.location).toBe('discard');
            expect(this.panpacaAnga.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            this.player1.clickCard(this.mimicGel);
            expect(this.player1).toHavePrompt('Mimic Gel');
            expect(this.player1).toHavePromptButton('Discard this card');
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not stop non mimic gel cards from being played', function () {
            this.player1.useAction(this.keyToDis, true);
            this.player1.clickCard(this.dextre);

            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should prompt the player to pick a creature when played', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Mimic Gel');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.panpacaAnga);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.titanGuardian);
            expect(this.player1).toBeAbleToSelect(this.xenosBloodshadow);
        });

        it('should come into play as a copy of the chosen creature', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.panpacaAnga);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.power).toBe(5);
            expect(this.mimicGel.name).toBe('Panpaca, Anga');
            expect(this.batdrone.power).toBe(4);
            expect(this.titanGuardian.power).toBe(7);
        });

        it('should allow copying creatures with alpha keyword', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.bumblebird);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasTrait('insect')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.power).toBe(1);
            expect(this.mimicGel.name).toBe('Bumblebird');
            expect(this.batdrone.power).toBe(2);
            expect(this.tantadlin.power).toBe(11);
        });

        it('should copy omega keyword and end turn', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.duskwitch);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('human')).toBe(true);
            expect(this.mimicGel.hasTrait('witch')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.getKeywordValue('omega')).toBe(1);
            expect(this.mimicGel.power).toBe(1);
            expect(this.mimicGel.name).toBe('Duskwitch');
            expect(this.mimicGel.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it('should copy elusive and hazardous keyword', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.xenosBloodshadow);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(4);
            expect(this.mimicGel.armor).toBe(0);
            expect(this.mimicGel.getKeywordValue('elusive')).toBe(1);
            expect(this.mimicGel.getKeywordValue('hazardous')).toBe(6);
            expect(this.mimicGel.name).toBe('Xenos Bloodshadow');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.mimicGel);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.mimicGel.tokens.damage).toBeUndefined();
        });

        it('should copy taunt keyword', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.titanGuardian);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasTrait('cyborg')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.getKeywordValue('taunt')).toBe(1);
            expect(this.mimicGel.power).toBe(5);
            expect(this.mimicGel.armor).toBe(1);
            expect(this.mimicGel.name).toBe('Titan Guardian');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard('flaxia');
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.mimicGel);
            expect(this.player2).toBeAbleToSelect(this.titanGuardian);
            expect(this.player2).not.toBeAbleToSelect(this.batdrone);
            expect(this.player2).not.toBeAbleToSelect(this.tantadlin);
        });
    });
});
