describe('setup phase', function() {
    integration(function() {
        describe('setting up normal cards', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', ['Arya Stark (Core)', 'Eddard Stark (Core)', 'Eddard Stark (Core)', 'Eddard Stark (WotN)', 'The Roseroad', 'Hear Me Roar!']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.arya = this.player1.findCardByName('Arya Stark (Core)');
                [this.ned1, this.ned2] = this.player1.filterCardsByName('Eddard Stark (Core)');
                this.wotnNed = this.player1.findCardByName('Eddard Stark (WotN)');
                this.roseroad = this.player1.findCardByName('The Roseroad');
                this.hearMeRoar = this.player1.findCardByName('Hear Me Roar!');
            });

            it('should only allow placement of 8 gold worth of cards', function() {
                this.player1.clickCard(this.roseroad);
                this.player1.clickCard(this.ned1);
                this.player1.clickCard(this.arya);


                expect(this.roseroad.location).toBe('play area');
                expect(this.ned1.location).toBe('play area');
                expect(this.arya.location).toBe('hand');
                expect(this.player1Object.gold).toBe(1);
            });

            it('should not trigger any enters play abilities', function() {
                this.player1.clickCard(this.arya);
                expect(this.player1).toHavePrompt('Select setup cards');

                this.completeSetup();

                expect(this.arya.dupes.size()).toBe(0);
                expect(this.player1).toHavePrompt('Select a plot');
            });

            it('should not allow events to be played', function() {
                this.player1.clickCard(this.hearMeRoar);

                expect(this.player1Object.gold).toBe(8);
                expect(this.hearMeRoar.location).toBe('hand');
            });

            describe('when setting up dupes', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.ned1);
                });

                it('should allow the same card to be set up as a dupe for free', function() {
                    this.player1.clickCard(this.ned2);

                    expect(this.player1Object.gold).toBe(1);

                    this.completeSetup();

                    expect(this.player1Object.cardsInPlay.size()).toBe(1);
                    expect(this.ned1.dupes).toContain(this.ned2);
                });

                it('should allow a card with the same name to be set up as a dupe for free', function() {
                    this.player1.clickCard(this.wotnNed);

                    expect(this.player1Object.gold).toBe(1);

                    this.completeSetup();

                    expect(this.player1Object.cardsInPlay.size()).toBe(1);
                    expect(this.ned1.dupes).toContain(this.wotnNed);
                });
            });
        });

        describe('when a card is limited', function() {
            beforeEach(function() {
                const deck = this.buildDeck('tyrell', ['The Roseroad', 'The Arbor', 'The Arbor']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.roseroad = this.player1.findCardByName('The Roseroad');
                [this.arbor1, this.arbor2] = this.player1.filterCardsByName('The Arbor');
            });

            it('should not allow more than one limited location to be placed', function() {
                this.player1.clickCard(this.roseroad);
                this.player1.clickCard(this.arbor1);

                expect(this.roseroad.location).toBe('play area');
                expect(this.arbor1.location).toBe('hand');
            });

            it('should not allow duplicates of a single limited location to be placed', function() {
                this.player1.clickCard(this.arbor1);
                this.player1.clickCard(this.arbor2);

                expect(this.arbor1.location).toBe('play area');
                expect(this.arbor2.location).toBe('hand');
            });
        });

        describe('when attachments are put out in the setup phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', ['Red God\'s Blessing', 'Dragonstone Faithful']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Dragonstone Faithful');
                this.attachment = this.player1.findCardByName('Red God\'s Blessing');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);

                this.completeSetup();
            });

            it('should prompt the user to attach stray attachments', function() {
                expect(this.player1).toHavePrompt('Select attachment locations');
            });

            describe('when the attachments have been placed', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.attachment);
                    this.player1.clickCard(this.character);
                });

                it('should attach to the selected card', function() {
                    expect(this.character.attachments).toContain(this.attachment);
                });

                it('should properly calculate the effects of the attachment', function() {
                    expect(this.character.getStrength()).toBe(2);
                });

                it('should continue to the plot phase', function() {
                    expect(this.player1).toHavePrompt('Select a plot');
                });
            });
        });

        describe('when dupes are put out in the setup phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', ['Sneak Attack', 'The Wall', 'The Wall', 'Steward at the Wall']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.sneakAttack = this.player1.findCardByName('Sneak Attack');
                [this.wall1, this.wall2] = this.player1.filterCardsByName('The Wall');
                this.character = this.player1.findCardByName('Steward at the Wall');
                this.opponentSneakAttack = this.player2.findCardByName('Sneak Attack');

                this.player1.clickCard(this.wall1);
                this.player1.clickCard(this.wall2);
                this.player1.clickCard(this.character);
            });

            it('should not count duplicates toward character strength', function() {
                this.completeSetup();

                expect(this.wall1.dupes.size()).toBe(1);
                expect(this.player1Object.cardsInPlay.size()).toBe(2);
                expect(this.character.getStrength()).toBe(2);
            });

            it('should allow dupes to be dragged back to hand', function() {
                this.player1.dragCard(this.wall2, 'hand');

                expect(this.wall2.location).toBe('hand');
                expect(this.player1Object.cardsInPlay).not.toContain(this.wall2);
            });

            it('should not double trigger reactions', function() {
                this.completeSetup();
                this.player1.selectPlot(this.sneakAttack);
                this.player2.selectPlot(this.opponentSneakAttack);
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.clickPrompt('The Wall');

                expect(this.player1).not.toHavePromptButton('The Wall');
            });
        });

        describe('when a persistent reducer is set up', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', ['Renly Baratheon (TtB)', 'Steward at the Wall']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.renly = this.player1.findCardByName('Renly Baratheon (TtB)');
                this.character = this.player1.findCardByName('Steward at the Wall');

                this.player1.clickCard(this.renly);
            });

            it('should not reduce cards during setup', function() {
                this.player1.clickCard(this.character);

                expect(this.player1Object.gold).toBe(1);
            });
        });
    });
});
