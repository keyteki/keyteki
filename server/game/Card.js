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
const ResolveReapAction = require('./GameActions/ResolveReapAction');
const RemoveStun = require('./BaseActions/RemoveStun');

class Card extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.image = cardData.image;
        this.setDefaultController(owner);

        this.printedType = cardData.type;

        this.tokens = {};

        this.abilities = { actions: [], reactions: [], persistentEffects: [] };
        this.traits = cardData.traits || [];
        this.setupCardAbilities(AbilityDsl);
        this.printedKeywords = {};
        for(let keyword of cardData.keywords || []) {
            let split = keyword.split(':');
            let value = 1;
            if(split.length > 1) {
                value = parseInt(split[1]);
            }

            this.printedKeywords[split[0]] = value;
            this.persistentEffect({
                location: 'any',
                match: this,
                effect: AbilityDsl.effects.addKeyword({ [split[0]]: value })
            });
        }

        if(this.type === 'creature') {
            this.setupKeywordAbilities(AbilityDsl);
        }

        // alpha
        this.persistentEffect({
            location: 'any',
            printedAbility: false,
            condition: () => !!this.getKeywordValue('alpha'),
            match: this,
            effect: AbilityDsl.effects.cardCannot('play', () => !this.game.firstThingThisTurn())
        });

        // enraged
        this.persistentEffect({
            location: 'any',
            printedAbility: false,
            condition: () => {
                return this.tokens.enrage >= 1;
            },
            match: this,
            effect: AbilityDsl.effects.mustFightIfAble()
        });

        // warded
        this.interrupt({
            when: {
                onCardMarkedForDestruction: (event, context) => event.card === context.source && context.source.warded,
                onCardLeavesPlay: (event, context) => event.card === context.source && context.source.warded,
                onCardDestroyed: (event, context) => event.card === context.source && context.source.warded,
                onDamageDealt: (event, context) => event.card === context.source && !context.event.noGameStateCheck && context.source.warded
            },
            effect: 'remove its ward token',
            gameAction: [
                AbilityDsl.actions.changeEvent(context => {
                    let card = context.event.card;
                    let cancel = true;

                    if((card.power <= 0 || card.tokens.damage >= card.power) && !card.moribund) {
                        context.event.card.unward();
                        cancel = false;
                    }

                    return {
                        event: context.event,
                        cancel: cancel
                    };
                }),
                AbilityDsl.actions.removeWard()
            ]
        });

        this.printedHouse = cardData.house;
        this.cardPrintedAmber = cardData.amber;
        this.maverick = cardData.maverick;
        this.anomoly = cardData.anomoly;

        this.upgrades = [];
        this.parent = null;
        this.childCards = [];
        this.clonedNeighbors = null;

        this.printedPower = cardData.power;
        this.printedArmor = cardData.armor;
        this.armorUsed = 0;
        this.exhausted = false;
        this.stunned = false;
        this.moribund = false;
        this.isFighting = false;

        this.locale = cardData.locale;

        this.menu = [
            { command: 'exhaust', text: 'Exhaust/Ready' },
            { command: 'addDamage', text: 'Add 1 damage' },
            { command: 'remDamage', text: 'Remove 1 damage' },
            { command: 'addAmber', text: 'Add 1 amber' },
            { command: 'remAmber', text: 'Remove 1 amber' },
            { command: 'addEnrage', text: 'Add 1 enrage' },
            { command: 'remEnrage', text: 'Remove 1 enrage' },
            { command: 'stun', text: 'Stun/Remove Stun' },
            { command: 'addWard', text: 'Add 1 ward' },
            { command: 'remWard', text: 'Remove 1 ward' },
            { command: 'control', text: 'Give control' }
        ];

        this.endRound();
    }

    get name() {
        const copyEffect = this.mostRecentEffect('copyCharacter');
        return copyEffect ? copyEffect.printedName : this.printedName;
    }

    get type() {
        return this.mostRecentEffect('changeType') || this.printedType;
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
            printedAbility: false,
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: context.source.getKeywordValue('assault'),
                target: context.event.card,
                damageSource: context.source,
                damageType: 'assault'
            }))
        });

        // Hazardous
        this.interrupt({
            title: 'Hazardous',
            printedAbility: false,
            when: {
                onFight: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: context.source.getKeywordValue('hazardous'),
                target: context.event.attacker,
                damageSource: context.source,
                damageType: 'hazardous'
            }))
        });

        // Taunt
        this.persistentEffect({
            condition: () => !!this.getKeywordValue('taunt'),
            printedAbility: false,
            match: card => this.neighbors.includes(card) && !card.getKeywordValue('taunt'),
            effect: ability.effects.cardCannot('attackDueToTaunt')
        });

        // Fight
        this.action({
            title: 'Fight with this creature',
            condition: context => this.checkRestrictions('fight', context),
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a creature to attack',
                cardType: 'creature',
                controller: 'opponent',
                gameAction: new ResolveFightAction({ attacker: this })
            }
        });

        // Reap
        this.action({
            title: 'Reap with this creature',
            condition: context => this.checkRestrictions('reap', context),
            printedAbility: false,
            gameAction: new ResolveReapAction()
        });

        // Invulnerable
        this.persistentEffect({
            condition: () => !!this.getKeywordValue('invulnerable'),
            printedAbility: false,
            effect: [
                ability.effects.cardCannot('damage'),
                ability.effects.cardCannot('destroy')
            ]
        });
    }

    play(properties) {
        if(this.type === 'action') {
            properties.location = properties.location || 'being played';
        }

        return this.reaction(Object.assign({ play: true, name: 'Play' }, properties));
    }

    fight(properties) {
        return this.reaction(Object.assign({ fight: true, name: 'Fight' }, properties));
    }

    reap(properties) {
        return this.reaction(Object.assign({ reap: true, name: 'Reap' }, properties));
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

    beforeFight(properties) {
        properties.when = { onFight: (event, context) => event.attacker === context.source };
        if(properties.condition) {
            properties.when = { onFight: (event, context) => event.attacker === context.source && properties.condition(context) };
        }

        return this.interrupt(properties);
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
        if(properties.play || properties.fight || properties.reap) {
            properties.when = {
                onCardPlayed: (event, context) => event.card === context.source,
                onFight: (event, context) => event.attacker === context.source,
                onReap: (event, context) => event.card === context.source
            };
        }

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

        let ability = _.extend({ duration: 'persistent', location: location }, properties);
        this.abilities.persistentEffects.push(ability);
        return ability;
    }

    hasTrait(trait) {
        if(!trait) {
            return false;
        }

        trait = trait.toLowerCase();
        return this.traits.includes(trait) || this.getEffects('addTrait').includes(trait);
    }

    getTraits() {
        let traits = this.traits.concat(this.getEffects('addTrait'));
        return _.uniq(traits);
    }

    getHouses() {
        let combinedHouses = [];

        if(this.anyEffect('changeHouse')) {
            combinedHouses = combinedHouses.concat((this.getEffects('changeHouse')));
        } else {
            combinedHouses.push(this.printedHouse);
        }

        if(this.anyEffect('addHouse')) {
            combinedHouses = combinedHouses.concat(this.getEffects('addHouse'));
        }

        return combinedHouses;
    }

    hasHouse(house) {
        if(!house) {
            return false;
        }

        house = house.toLowerCase();
        if(this.anyEffect('changeHouse')) {
            return this.getEffects('changeHouse').includes(house);
        }

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
        if(this.type === 'creature' && this.hasToken('amber') && this.controller.opponent) {
            this.game.actions.gainAmber({ amount: this.tokens.amber }).resolve(this.controller.opponent, this.game.getFrameworkContext());
        }

        this.exhausted = false;
        this.stunned = false;
        this.moribund = false;
        this.new = false;
        this.tokens = {};
        this.setDefaultController(this.owner);
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
        if(from === 'play area' || from === 'being played') {
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

        if(['play area', 'discard', 'hand', 'purged', 'grafted'].includes(targetLocation)) {
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
        return super.checkRestrictions(actionType, context) && (!context || !context.player || context.player.checkRestrictions(actionType, context));
    }


    addToken(type, number = 1) {
        if(!number || !Number.isInteger(number)) {
            return;
        }

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

    clearToken(type) {
        if(this.tokens[type]) {
            delete this.tokens[type];
        }
    }

    readiesDuringReadyPhase() {
        return !this.anyEffect('doesNotReady');
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    hasKeyword(keyword) {
        return !!this.getKeywordValue(keyword);
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        if(this.getEffects('removeKeyword').includes(keyword)) {
            return 0;
        }

        return this.getEffects('addKeyword').reduce((total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0), 0);
    }

    createSnapshot() {
        let clone = new Card(this.owner, this.cardData);

        clone.upgrades = this.upgrades.map(upgrade => upgrade.createSnapshot());
        clone.effects = _.clone(this.effects);
        clone.tokens = _.clone(this.tokens);
        clone.controller = this.controller;
        clone.exhausted = this.exhausted;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.clonedNeighbors = this.neighbors;
        clone.modifiedPower = this.getPower();
        return clone;
    }

    get printedAmber() {
        return this.cardData.amber + this.sumEffects('modifyAmberValue');
    }

    get power() {
        return this.getPower();
    }

    getPower(printed = false) {
        if(printed) {
            return this.printedPower;
        }

        return this.sumEffects('modifyPower') + this.printedPower + (this.hasToken('power') ? this.tokens.power : 0);
    }

    getBonusDamage(target) {
        let effects = this.getEffects('bonusDamage');
        return effects.reduce((total, match) => total + match(target), 0);
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

    get amber() {
        return this.hasToken('amber') ? this.tokens.amber : 0;
    }

    get enraged() {
        return this.hasToken('enrage');
    }

    enrage() {
        if(!this.hasToken('enrage')) {
            this.addToken('enrage');
        }
    }

    unenrage() {
        this.clearToken('enrage');
    }

    stun() {
        this.stunned = true;
    }

    unstun() {
        this.stunned = false;
    }

    get warded() {
        return this.hasToken('ward');
    }

    ward() {
        if(!this.hasToken('ward')) {
            this.addToken('ward');
        }
    }

    unward() {
        this.clearToken('ward');
    }

    exhaust() {
        this.exhausted = true;
    }

    ready() {
        this.exhausted = false;
    }

    removeAttachment(card) {
        this.upgrades = this.upgrades.filter(c => c !== card);
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

    canPlayAsUpgrade() {
        return this.anyEffect('canPlayAsUpgrade') || this.type === 'upgrade';
    }

    /**
     * Checks whether the passed card meets the upgrade restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card, context) { // eslint-disable-line no-unused-vars
        return card && card.getType() === 'creature' && this.canPlayAsUpgrade();
    }

    use(player, ignoreHouse = false) {
        let legalActions = this.getLegalActions(player, ignoreHouse);

        if(legalActions.length === 0) {
            return false;
        } else if(legalActions.length === 1) {
            let action = legalActions[0];
            if(!this.game.activePlayer.optionSettings.confirmOneClick || ignoreHouse) {
                let context = action.createContext(player);
                context.ignoreHouse = ignoreHouse;
                this.game.resolveAbility(context);
                return true;
            }
        }

        let choices = legalActions.map(action => action.title);
        let handlers = legalActions.map(action => () => {
            let context = action.createContext(player);
            context.ignoreHouse = ignoreHouse;
            this.game.resolveAbility(context);
        });
        if(!ignoreHouse) {
            choices = choices.concat('Cancel');
            handlers = handlers.concat(() => true);
        }

        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: (this.location === 'play area' ? 'Choose an ability:' :
                { text: 'Play {{card}}:', values: { card: this.name } }),
            source: this,
            choices: choices,
            handlers: handlers
        });

        return true;
    }

    getLegalActions(player, ignoreHouse = false) {
        let actions = this.getActions();
        actions = actions.filter(action => {
            let context = action.createContext(player);
            context.ignoreHouse = ignoreHouse;
            return !action.meetsRequirements(context);
        });
        let canFight = actions.findIndex(action => action.title === 'Fight with this creature') >= 0;
        if(this.getEffects('mustFightIfAble').length > 0 && canFight) {
            actions = actions.filter(action => action.title === 'Fight with this creature');
        }

        return actions;
    }

    getActions(location = this.location) {
        let actions = [];
        if(location === 'hand') {
            if(this.type === 'creature') {
                actions.push(new PlayCreatureAction(this));
            } else if(this.type === 'artifact') {
                actions.push(new PlayArtifactAction(this));
            } else if(this.type === 'action') {
                actions.push(new PlayAction(this));
            }

            if(this.canPlayAsUpgrade()) {
                actions.push(new PlayUpgradeAction(this));
            }

            actions.push(new DiscardAction(this));
        } else if(location === 'play area' && this.type === 'creature') {
            //actions.push(new FightAction(this));
            //actions.push(new ReapAction(this));
            actions.push(new RemoveStun(this));
        }

        return actions.concat(this.abilities.actions.slice());
    }

    setDefaultController(player) {
        this.defaultController = player;
        this.controller = player;
    }

    getModifiedController() {
        if(this.location === 'play area') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }

        return this.owner;
    }

    isOnFlank(flank) {
        if(this.type !== 'creature') {
            return false;
        }

        let position = this.controller.cardsInPlay.indexOf(this);
        if(flank === 'left') {
            return (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) &&
                position === 0;
        } else if(flank === 'right') {
            return (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) &&
                position === this.controller.cardsInPlay.length - 1;
        }

        return this.anyEffect('consideredAsFlank') || this.neighbors.length < 2;
    }

    isInCenter() {
        let creatures = this.controller.cardsInPlay.filter(card => card.type === 'creature');
        let mid = Math.floor(creatures.length / 2);
        let centerCreature = creatures[mid];

        return (this === centerCreature);
    }

    get neighbors() {
        if(this.type !== 'creature') {
            return [];
        } else if(this.clonedNeighbors) {
            return this.clonedNeighbors;
        }

        let creatures = this.controller.cardsInPlay.filter(card => card.type === 'creature');
        let index = creatures.indexOf(this);
        let neighbors = [];

        if(index < 0) {
            return neighbors;
        } else if(index > 0) {
            neighbors.push(creatures[index - 1]);
        }

        if(index < creatures.length - 1) {
            neighbors.push(creatures[index + 1]);
        }

        return neighbors;
    }

    ignores(trait) {
        return this.getEffects('ignores').includes(trait);
    }

    getShortSummary() {
        let result = super.getShortSummary();

        // Include card specific information useful for UI rendering
        result.maverick = this.maverick;
        result.anomoly = this.anomoly;
        result.cardPrintedAmber = this.cardPrintedAmber;
        result.locale = this.locale;
        return result;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isController = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        if(!isController && (this.facedown || hideWhenFaceup) && !(this.game.showHand && activePlayer.isSpectator() && this.location === 'hand')) {
            let state = {
                cardback: this.owner.deckData.cardback,
                controller: this.controller.name,
                facedown: true,
                location: this.location
            };
            return Object.assign(state, selectionState);
        }

        let state = {
            anomoly: this.anomoly,
            id: this.cardData.id,
            image: this.cardData.image,
            canPlay: (activePlayer === this.game.activePlayer) && this.game.activePlayer.activeHouse &&
                isController && (this.getLegalActions(activePlayer, false).length > 0),
            cardback: this.owner.deckData.cardback,
            childCards: this.childCards.map(card => {
                return card.getSummary(activePlayer, hideWhenFaceup);
            }),
            controlled: this.owner !== this.controller,
            exhausted: this.exhausted,
            facedown: this.facedown,
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            new: this.new,
            printedHouse: this.printedHouse,
            maverick: this.maverick,
            cardPrintedAmber: this.cardPrintedAmber,
            stunned: this.stunned,
            taunt: !!this.getKeywordValue('taunt'),
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
