import MessageService from './MessageService.js';
import CardService from './CardService.js';
let services = {};

export const messageService = () => {
    if (!services.messageService) {
        services.messageService = new MessageService();
    }

    return services.messageService;
};

export const cardService = (configService) => {
    if (!services.cardService) {
        services.cardService = new CardService(configService);
    }

    return services.cardService;
};

export default {
    messageService,
    cardService
};
