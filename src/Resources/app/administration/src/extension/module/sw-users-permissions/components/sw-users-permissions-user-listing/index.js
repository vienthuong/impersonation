import template from './sw-users-permissions-user-listing.html.twig';
import initializeUserContext from 'src/app/init-post';
import { IMPERSONATING_ATTRIBUTE_KEY } from '../../../../../constant/impersonation.constant';
const { Component } = Shopware;

const componentConfiguration = {
    computed: {
        currentUser() {
            return Shopware.State.get('session').currentUser;
        },
    },

    methods: {
        async impersonate(userId) {
            this.isLoading = true;

            localStorage.setItem(IMPERSONATING_ATTRIBUTE_KEY, userId);
            await initializeUserContext.userInformation();

            this.isLoading = false;

            this.$router.push({ name: 'sw.dashboard.index' });
        }
    }
};

// Using sw-settings-user-list until its deprecated
if (!Component.getComponentRegistry().has('sw-settings-user-list')) {
    Component.override('sw-users-permissions-user-listing', {
        template,
        ...componentConfiguration
    });
} else {
    /**
     * @deprecated tag:v6.4.0 - use 'sw-users-permissions-user-listing' instead
     */
    Component.override('sw-settings-user-list', {
        template,

        deprecated: {
            version: '6.4.0',
            comment: 'Use sw-users-permissions-user-listing instead'
        },
        ...componentConfiguration
    });
}
