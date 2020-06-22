describe('Entropic Manipulator', function () {
    describe("Entropic Manipulator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['entropic-manipulator'],
                    inPlay: ['batdrone', 'troll']
                },
                player2: {
                    inPlay: ['sequis', 'zorg'],
                    hand: ['armageddon-cloak']
                }
            });
            this.troll.tokens.damage = 6;
            this.zorg.tokens.damage = 3;
        });

        it('should not use up armor', function () {
            this.player1.play(this.entropicManipulator);
            expect(this.player1).toHavePrompt('Entropic Manipulator');
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).toHavePrompt('Entropic Manipulator');
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.zorg.tokens.damage).toBeUndefined();
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.tokens.damage).toBe(1);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow a player to put more than lethal damage on a creature', function () {
            this.player1.play(this.entropicManipulator);
            expect(this.player1).toHavePrompt('Entropic Manipulator');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toHavePrompt('Entropic Manipulator');
            expect(this.zorg.tokens.damage).toBe(3);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.damage).toBe(1);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('play area');
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.damage).toBe(5);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should protect a creature with Armageddon Cloak', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playUpgrade(this.armageddonCloak, this.batdrone);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');

            this.player1.play(this.entropicManipulator);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.damage).toBe(5);
            this.player1.clickCard(this.batdrone);
            expect(this.armageddonCloak.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should kill a warded creature', function () {
            this.batdrone.ward();
            this.player1.play(this.entropicManipulator);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.damage).toBe(5);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
