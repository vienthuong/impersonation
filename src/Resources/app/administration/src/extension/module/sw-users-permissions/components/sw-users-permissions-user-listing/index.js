import template from './sw-users-permissions-user-listing.html.twig';
const { Component, Service, State } = Shopware;

const componentConfiguration = {
    computed: {
        impersonationService() {
            return Service('impersonationService');
        },

        currentUser() {
            return State.get('session').currentUser;
        },

        canImpersonate() {
            return !!this.currentUser.admin;
        },

        isImpersonating() {
            return this.impersonationService.isImpersonating();
        }
    },

    methods: {
        async impersonate(userId) {
            if (!this.canImpersonate) {
                return;
            }

            this.isLoading = true;

            await this.impersonationService.impersonate(userId);

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
