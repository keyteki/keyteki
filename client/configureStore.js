import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const configureStore = import.meta.env.PROD ? configureStoreProd : configureStoreDev;

export default configureStore;
