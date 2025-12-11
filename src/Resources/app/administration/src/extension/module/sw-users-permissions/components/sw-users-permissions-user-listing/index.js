import template from './sw-users-permissions-user-listing.html.twig';
const { Component, Service} = Shopware;

Component.override('sw-users-permissions-user-listing', {
    template,
    computed: {
        impersonationService() {
            return Service('impersonationService');
        },

        currentUser() {
            return Shopware.Store.get('session').currentUser;
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
});
