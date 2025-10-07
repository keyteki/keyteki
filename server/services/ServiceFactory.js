import MessageService from './MessageService.js';
import CardService from './CardService.js';

let services = {};

export default {
    messageService: () => {
        if (!services.messageService) {
            services.messageService = new MessageService();
        }

        return services.messageService;
    },
    cardService: (configService) => {
        if (!services.cardService) {
            services.cardService = new CardService(configService);
        }

        return services.cardService;
    }
};
