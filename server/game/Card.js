const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const EffectSource = require('./EffectSource.js');
const TriggeredAbility = require('./triggeredability');

const DiscardAction = require('./BaseActions/DiscardAction');
const PlayAction = require('./BaseActions/PlayAction');
const PlayCreatureAction = require('./BaseActions/PlayCreatureAction');
const PlayArtifactAction = require('./BaseActions/PlayArtifactAction');
const PlayUpgradeAction = require('./BaseActions/PlayUpgradeAction');
const ResolveFightAction = require('./GameActions/ResolveFightAction');
//const FightAction = require('./BaseActions/FightAction');
const ReapAction = require('./BaseActions/ReapAction');
const RemoveStun = require('./BaseActions/RemoveStun');

class Card extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.controller = owner;
        this.defaultController = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.name = cardData.name;

        this.type = cardData.type;

        this.tokens = {};

        this.abilities = { actions: [], reactions: [], persistentEffects: [] };
        this.traits = cardData.traits || [];
        this.setupCardAbilities(AbilityDsl);
        if(this.type === 'creature') {
            this.setupKeywordAbilities(AbilityDsl);
        }

        this.printedHouse = cardData.house;
        this.printedAmber = cardData.amber;

        this.upgrades = [];
        this.parent = null;

        this.printedPower = cardData.power;
        this.printedArmor = cardData.armor;
        this.armorUsed = 0;
        this.exhausted = false;
        this.stunned = false;

        this.keywords = cardData.keywords;

        this.menu = [
            { command: 'exhaust', text: 'Exhaust/Ready' },
            { command: 'addDamage', text: 'Add 1 damage' },
            { command: 'remDamage', text: 'Remove 1 damage' },
            { command: 'addAmber', text: 'Add 1 amber' },
            { command: 'remAmber', text: 'Remove 1 amber' },
            { command: 'stun', text: 'Stun/Remove Stun' },
            { command: 'control', text: 'Give control' }
        ];

        this.endRound();
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param ability - object containing limits, costs, effects, and game actions
     */
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    setupKeywordAbilities(ability) {
        // Assault
        this.interrupt({
            title: 'Assault',
            printedAbiliy: false,
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: context.source.getKeywordValue('assault'),
                target: context.event.card
            }))
        });

        // Hazardous
        this.interrupt({
            title: 'Hazardous',
            printedAbiliy: false,
            when: {
                onFight: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: context.source.getKeywordValue('hazardous'),
                target: context.event.attacker
            }))
        });

        // Taunt
        this.persistentEffect({
            condition: () => !!this.getKeywordValue('taunt'),
            match: card => this.neighbors.includes(card) && !card.getKeywordValue('taunt'),
            effect: ability.effects.cardCannot('attack')
        });

        // Fight
        this.action({
            title: 'Fight with this creature',
            printedAbiliy: false,
            target: {
                activePromptTitle: 'Choose a creature to attack',
                cardType: 'creature',
                controller: 'opponent',
                gameAction: new ResolveFightAction({ attacker: this })
            }
        });

        // Remove Stun
        this.action({
            title: 'Remove this creature\'s stun',
            printedAbiliy: false,
            condition: () => this.stunned,
            gameAction: ability.actions.removeStun()
        });

        /*
        // Reap
        this.action({
            title: 'Reap with this creature',
            gameAction:
        })*/
    }

    play(properties) {
        if(properties.fight) {
            this.fight(_.omit(properties, 'fight'));
        } else if(properties.reap) {
            this.reap(_.omit(properties, 'reap'));
        }
        let when = { onCardPlayed: (event, context) => event.card === context.source };
        if(properties.condition) {
            when = { onCardPlayed: (event, context) => event.card === context.source && properties.condition(context) };
        }
        if(this.type === 'action') {
            properties.location = properties.location || 'being played';
        }
        return this.reaction(Object.assign({ when: when, name: 'Play' }, properties));
    }

    fight(properties) {
        if(properties.reap) {
            this.reap(_.omit(properties, 'reap'));
        }
        let when = { onFight: (event, context) => event.attacker === context.source };
        if(properties.condition) {
            when = { onFight: (event, context) => event.attacker === context.source && properties.condition(context) };
        }
        return this.reaction(Object.assign({ when: when, name: 'Fight' }, properties));
    }

    reap(properties) {
        properties.when = { onReap: (event, context) => event.card === context.source };
        if(properties.condition) {
            properties.when = { onReap: (event, context) => event.card === context.source && properties.condition(context) };
        }
        properties.name = 'Reap';
        return this.reaction(properties);
    }

    destroyed(properties) {
        properties.when = { onCardDestroyed: (event, context) => event.card === context.source };
        if(properties.condition) {
            properties.when = { onCardDestroyed: (event, context) => event.card === context.source && properties.condition(context) };
        }
        return this.interrupt(properties);
    }

    leavesPlay(properties) {
        properties.when = { onCardLeavesPlay: (event, context) => event.card === context.source };
        if(properties.condition) {
            properties.when = { onCardLeavesPlay: (event, context) => event.card === context.source && properties.condition(context) };
        }
        return this.interrupt(properties);
    }

    omni(properties) {
        properties.omni = true;
        return this.action(properties);
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        this.abilities.actions.push(action);
        return action;
    }

    triggeredAbility(abilityType, properties) {
        let reaction = new TriggeredAbility(this.game, this, abilityType, properties);
        this.abilities.reactions.push(reaction);
        return reaction;
    }

    constantReaction(properties) {
        return this.triggeredAbility('constant', properties);
    }

    reaction(properties) {
        return this.triggeredAbility('reaction', properties);
    }

    interrupt(properties) {
        return this.triggeredAbility('interrupt', properties);
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = ['any', 'play area'];
        let location = properties.location || 'play area';
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(_.extend({ duration: 'persistent', location: location }, properties));
    }

    hasTrait(trait) {
        trait = trait.toLowerCase();
        return this.traits.includes(trait) || this.getEffects('addTrait').includes(trait);
    }

    getTraits() {
        let traits = this.traits.concat(this.getEffects('addTrait'));
        return _.uniq(traits);
    }

    hasHouse(house) {
        house = house.toLowerCase();
        return this.printedHouse === house || this.getEffects('addHouse').includes(house);
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === 'any') {
                this.addEffectToEngine(effect);
            }
        });
    }

    onLeavesPlay() {
        if(this.parent && this.parent.upgrades) {
            this.parent.removeUpgrade(this);
            this.parent = null;
        }
        this.exhausted = false;
        this.new = false;
        this.tokens = {};
        this.controller = this.owner;
        this.endRound();
    }

    endRound() {
        this.armorUsed = 0;
        this.elusiveUsed = false;
    }

    updateAbilityEvents(from, to) {
        _.each(this.abilities.reactions, reaction => {
            if(reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
    }

    updateEffects(from = '', to = '') {
        if(from === 'play area') {
            this.removeLastingEffects();
        }
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location !== 'any') {
                if(to === 'play area' && from !== 'play area') {
                    effect.ref = this.addEffectToEngine(effect);
                } else if(to !== 'play area' && from === 'play area') {
                    this.removeEffectFromEngine(effect.ref);
                }
            }
        });
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if(['play area', 'discard', 'hand'].includes(targetLocation)) {
            this.facedown = false;
        }
        if(originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    getMenu() {
        var menu = [];

        if(!this.menu.length || !this.game.manualMode || this.location !== 'play area') {
            return undefined;
        }

        if(this.facedown) {
            return [{ command: 'reveal', text: 'Reveal' }];
        }

        menu.push({ command: 'click', text: 'Select Card' });
        if(this.location === 'play area') {
            menu = menu.concat(this.menu);
        }

        return menu;
    }

    checkRestrictions(actionType, context = null) {
        return super.checkRestrictions(actionType, context) && this.controller.checkRestrictions(actionType, context);
    }


    addToken(type, number = 1) {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    removeToken(type, number = this.tokens[type]) {
        if(!this.tokens[type]) {
            return;
        }
        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    readiesDuringReadyPhase() {
        return !this.anyEffect('doesNotReady');
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        let reduceFunc = (total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0);
        return this.getEffects('addKeyword').reduce(reduceFunc, reduceFunc(0, this.keywords));
    }

    createSnapshot() {
        let clone = new Card(this.owner, this.cardData);

        clone.upgrades = _(this.upgrades.map(upgrade => upgrade.createSnapshot()));
        clone.effects = _.clone(this.effects);
        clone.tokens = _.clone(this.tokens);
        clone.controller = this.controller;
        clone.exhausted = this.exhausted;
        clone.location = this.location;
        clone.parent = this.parent;
        return clone;
    }

    get power() {
        return this.getPower();
    }

    getPower(printed = false) {
        if(printed) {
            return this.printedPower;
        }
        return this.sumEffects('modifyPower') + this.printedPower;
    }

    getBonusDamage(target) {
        let effects = this.getEffects('bonusDamage');
        return effects.reduce((match, total) => total + match(target), 0);
    }

    get armor() {
        return this.getArmor();
    }

    getArmor(printed = false) {
        if(printed) {
            return this.printedArmor;
        }
        return this.sumEffects('modifyArmor') + this.printedArmor;
    }

    stun() {
        this.stunned = true;
    }

    unstun() {
        this.stunned = false;
    }

    exhaust() {
        this.exhausted = true;
    }

    ready() {
        this.exhausted = false;
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect
        });
    }

    /**
     * Checks whether the passed card meets the upgrade restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card, context) { // eslint-disable-line no-unused-vars
        return card && card.getType() === 'creature' && this.getType() === 'upgrade';
    }

    canPlay(context) {
        if(this.hasHouse(context.player.activeHouse) || this.anyEffect('canActivate')) {
            return true;
        } else if(context.player.getEffects('canPlay').some(match => match(context))) {
            return true;
        }
        let houseEffects = context.player.getEffects('canPlayHouse').filter(house => this.hasHouse(house));
        if(houseEffects.length) {
            context.game.effectEngine.unapplyAndRemove(effect => effect === houseEffects[0]);
            return true;
        }
        let nonHouseEffects = context.player.getEffects('canPlayNonHouse').filter(house => !this.hasHouse(house));
        if(nonHouseEffects.length) {
            context.game.effectEngine.unapplyAndRemove(effect => effect === nonHouseEffects[0]);
            return true;
        }
        return false;
    }

    canUse(context) {
        if(this.hasHouse(context.player.activeHouse) || this.anyEffect('canActivate')) {
            return true;
        } else if(context.player.getEffects('canUse').some(match => match(context))) {
            return true;
        }
        let houseEffects = context.player.getEffects('canUseHouse').filter(house => this.hasHouse(house));
        if(houseEffects.length) {
            context.game.effectEngine.unapplyAndRemove(effect => effect === houseEffects[0]);
            return true;
        }
        return false;
    }

    use(player, canCancel = true) {
        let actions = this.getActions(player);

        let legalActions = actions.filter(action => action.meetsRequirements(action.createContext(player)) === '');
        if(legalActions.length === 0) {
            return false;
        } else if(legalActions.length === 1) {
            let action = legalActions[0];
            let targetPrompts = action.targets.some(target => target.properties.player !== 'opponent');
            if(!this.game.activePlayer.optionSettings.confirmOneClick || targetPrompts || !canCancel) {
                this.game.resolveAbility(action.createContext(player));
                return true;
            }
        }
        let choices = legalActions.map(action => action.title);
        let handlers = legalActions.map(action => (() => this.game.resolveAbility(action.createContext(player))));
        if(canCancel) {
            choices = choices.concat('Cancel');
            handlers = handlers.concat(() => true);
        }
        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: (this.location === 'play area' ? 'Choose an ability:' : 'Play ' + this.name + ':'),
            source: this,
            choices: choices,
            handlers: handlers
        });
        return true;
    }

    getActions(player, location = this.location) {
        if(player !== this.controller) {
            return [];
        }
        let actions = [];
        if(location === 'hand') {
            if(this.type === 'upgrade') {
                actions.push(new PlayUpgradeAction(this));
            } else if(this.type === 'creature') {
                actions.push(new PlayCreatureAction(this));
            } else if(this.type === 'artifact') {
                actions.push(new PlayArtifactAction(this));
            } else if(this.type === 'action') {
                actions.push(new PlayAction(this));
            }
            actions.push(new DiscardAction(this));
        } else if(location === 'play area' && this.type === 'creature') {
            //actions.push(new FightAction(this));
            actions.push(new ReapAction(this));
            // actions.push(new RemoveStun(this));
        }
        return actions.concat(this.abilities.actions.slice());
    }

    /**
     * This removes an upgrade from this card's upgrade Array.  It doesn't open any windows for
     * game effects to respond to.
     * @param {Card} upgrade
     */
    removeUpgrade(upgrade) {
        this.upgrades = this.upgrades.filter(card => card.uuid !== upgrade.uuid);
    }

    setDefaultController(player) {
        this.defaultController = player;
    }

    getModifiedController() {
        if(this.location === 'play area') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }
        return this.owner;
    }

    isOnFlank() {
        return this.neighbors.length < 2;
    }

    get neighbors() {
        let index = this.controller.cardsInPlay.indexOf(this);
        let neighbors = [];
        if(index > 0) {
            neighbors.push(this.controller.cardsInPlay[index - 1]);
        }
        if(index < this.controller.cardsInPlay.length - 1) {
            neighbors.push(this.controller.cardsInPlay[index + 1]);
        }
        return neighbors;
    }

    ignores(trait) {
        return this.getEffects('ignores').includes(trait);
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.owner;
        let selectionState = activePlayer.getCardSelectionState(this);

        if(isActivePlayer ? this.facedown : (this.facedown || hideWhenFaceup)) {
            let state = {
                cardback: this.owner.deckData.cardback,
                controller: this.controller.name,
                facedown: true,
                location: this.location
            };
            return Object.assign(state, selectionState);
        }

        let state = {
            id: this.cardData.id,
            cardback: this.owner.deckData.cardback,
            controlled: this.owner !== this.controller,
            exhausted: this.exhausted,
            facedown: this.facedown,
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            new: this.new,
            stunned: this.stunned,
            tokens: this.tokens,
            type: this.getType(),
            upgrades: this.upgrades.map(upgrade => {
                return upgrade.getSummary(activePlayer, hideWhenFaceup);
            }),
            uuid: this.uuid
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = Card;
