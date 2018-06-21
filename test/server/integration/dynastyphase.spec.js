describe('dynasty phase', function() {
    integration(function() {
        describe('playing a card from a province', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('lion', [
                    'yojin-no-shiro',
                    'shameful-display', 'shameful-display', 'shameful-display', 'shameful-display', 'shameful-display',
                    'akodo-gunso', 'akodo-gunso', 'matsu-berserker', 'matsu-berserker',
                    'akodo-toturi', 'akodo-toturi', 'akodo-toturi', 'akodo-toturi',
                    'against-the-waves', 'against-the-waves', 'against-the-waves', 'against-the-waves'
                ]);
                const deck2 = this.buildDeck('dragon', [
                    'mountain-s-anvil-castle',
                    'shameful-display', 'shameful-display', 'shameful-display', 'shameful-display', 'shameful-display',
                    'doomed-shugenja', 'doomed-shugenja', 'doomed-shugenja',
                    'niten-master', 'niten-master', 'niten-master',
                    'togashi-kazue', 'togashi-kazue', 'togashi-kazue', 'togashi-kazue'
                ]);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.skipSetupPhase();

                this.akodoGunso = this.player1.placeCardInProvince('akodo-gunso', 'province 1');
                this.akodoToturi = this.player1.placeCardInProvince('akodo-toturi', 'province 2');
                this.matsuBerserker = this.player1.placeCardInProvince('matsu-berserker', 'province 3');

                this.doomedShugenja1 = this.player2.placeCardInProvince('doomed-shugenja', 'province 1');
                this.doomedShugenja2 = this.player2.findCard(card => card.id === 'doomed-shugenja' && card.location !== 'province 1');
                this.player2.placeCardInProvince(this.doomedShugenja2, 'province 2');
            });

            it('should prompt first player to play a card', function() {
                expect(this.player1).toHavePrompt('Click pass when done');
            });

            it('should not allow the player without priority to play a character', function() {
                this.player2.clickCard(this.doomedShugenja1);
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('should prompt the player for the amount of fate to place on the character', function() {
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Choose additional fate');
            });

            it('should stop players from placing more fate than they have', function() {
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).not.toHavePromptButton('3');
                expect(this.player1).not.toHavePromptButton(['More']);
            });

            it('should return to the dynasty prompt if the player clicks cancel', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Click pass when done');
            });

            it('should charge player for playing card and fate and pass priority', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');

                expect(this.akodoToturi.location).toBe('play area');
                expect(this.akodoToturi.fate).toBe(1);
                expect(this.player1.player.fate).toBe(1);
                expect(this.player2).toHavePrompt('Click pass when done');
            });

            it('should replace the played card with a facedown dynasty card', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');

                expect(this.player1.player.getDynastyCardInProvince('province 2').facedown).toBe(true);
            });

            it('should give the first player who passes 1 fate', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('Pass');

                expect(this.player2.player.fate).toBe(9);
            });

            it('should not pass priority to a player who has previously passed', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('0');
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('0');

                expect(this.player1).toHavePrompt('Click pass when done');
            });

            it('should not allow a player to play a card without enough fate', function() {
                this.player1.clickCard(this.akodoToturi); // 7 remaining
                this.player1.clickPrompt('1'); // 1 remaining
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.akodoGunso);

                expect(this.player1).not.toHavePrompt('Choose additional fate');
                expect(this.player1).toHavePrompt('Click pass when done');
            });

            it('should trigger any enters play abilities', function() {
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickPrompt('0');

                expect(this.akodoGunso.location).toBe('play area');
                expect(this.player1).toHavePrompt('Any reactions to Akodo Gunsō being played or Akodo Gunsō entering play?');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
            });

            it('should add a fate to a character when a duplicate is clicked', function() {
                this.akodoToturiDupe = this.player1.findCardByName('akodo-toturi', 'dynasty deck');
                this.player1.placeCardInProvince(this.akodoToturiDupe, 'province 4');
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.akodoToturiDupe);

                expect(this.akodoToturiDupe.location).toBe('dynasty discard pile');
                expect(this.akodoToturi.fate).toBe(2);
            });

            it('should allow events to be played', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');
                this.player2.clickCard(this.doomedShugenja1);
                this.player2.clickPrompt('0');
                this.player1.clickCard('against-the-waves');

                expect(this.doomedShugenja1.location).toBe('play area');
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja1);
            });

            // This is disabled until building decks using the api rather than the db is possible
            it('should not allow a player to play two limited cards', function() {
                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');
                this.player2.clickCard(this.doomedShugenja1);
                this.player2.clickPrompt('0');
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.doomedShugenja1);
                this.player2.clickCard(this.doomedShugenja2);

                expect(this.doomedShugenja1.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Click pass when done');
            });

            it('should allow a player to play a dupe from hand', function() {
                this.togashiKazueInPlay = this.player2.findCardByName('togashi-kazue', 'hand');
                this.player2.putIntoPlay(this.togashiKazueInPlay);
                this.togashiKazueInHand = this.player2.findCardByName('togashi-kazue', 'hand');

                this.player1.clickCard(this.akodoToturi);
                this.player1.clickPrompt('1');
                this.player2.clickCard(this.togashiKazueInHand);

                expect(this.togashiKazueInHand.location).toBe('conflict discard pile');
                expect(this.togashiKazueInPlay.fate).toBe(1);
                expect(this.player1).toHavePrompt('Click pass when done');
            });
        });
    });
});
