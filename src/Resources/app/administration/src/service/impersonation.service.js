import {IMPERSONATING_ATTRIBUTE_KEY} from "../constant/impersonation.constant";

const { Application, State } = Shopware;

class ImpersonationService {
    constructor(impersonatingUser, container, httpClient) {
        this.name = 'impersonationService';
        const {userService, localeHelper, loginService} = container;

        this.userService = userService;
        this.localeHelper = localeHelper;
        this.loginService = loginService;
        this.impersonatingUser = impersonatingUser;
        this.httpClient = httpClient;

        this._initializeService();
    }

    async impersonate(userId) {
        localStorage.setItem(IMPERSONATING_ATTRIBUTE_KEY, userId);

        const response = await this.userService.getUser({}, {
            [IMPERSONATING_ATTRIBUTE_KEY]: userId
        });

        const { data: { password, ...user } } = response;

        await this._initializeUser(user);
    }

    async leaveImpersonation() {
        localStorage.removeItem(IMPERSONATING_ATTRIBUTE_KEY);

        await this._initializeUser(this.impersonatingUser);
    }

    isImpersonating() {
        return !!localStorage.getItem(IMPERSONATING_ATTRIBUTE_KEY)
    }

    async _initializeUser(user) {
        State.commit('setCurrentUser', user);

        await this.localeHelper.setLocaleWithId(user.localeId);

        State.commit('context/setApiLanguageId', State.get('session').languageId);

        this.initializeUserNotifications();
    }

    _initializeService() {
        this.httpClient.interceptors.request.use(config => {
            if (this.isImpersonating()) {
                config.headers = config.headers || {};
                config.headers[IMPERSONATING_ATTRIBUTE_KEY] = localStorage.getItem(IMPERSONATING_ATTRIBUTE_KEY);
            }

            return config;
        });

        this._registerLogInListener();

        if (this.isImpersonating()) {
            this.impersonate(localStorage.getItem(IMPERSONATING_ATTRIBUTE_KEY));
        }
    }
    _registerLogInListener() {
        this.loginService.addOnLoginListener(async () => {
            if (this.isImpersonating()) {
                await this.leaveImpersonation();
            }
        });
    }

    initializeUserNotifications() {
        if (Application.getApplicationRoot().$store) {
            Application.getApplicationRoot().$store.commit('notification/setNotificationsForCurrentUser');
            return;
        }
    }
}

export default ImpersonationService;
