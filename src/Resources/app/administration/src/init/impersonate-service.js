import { IMPERSONATING_ATTRIBUTE_KEY } from '../constant/impersonation.constant';

const httpClient = Shopware.Application.getContainer('init').httpClient;

httpClient.interceptors.request.use(config => {
    const impersonatedId = localStorage.getItem(IMPERSONATING_ATTRIBUTE_KEY);
    if (impersonatedId) {
        config.headers = config.headers || {};
        config.headers[IMPERSONATING_ATTRIBUTE_KEY] = impersonatedId;
    }

    return config;
})
