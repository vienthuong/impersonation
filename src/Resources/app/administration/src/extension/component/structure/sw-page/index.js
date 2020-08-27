import template from './sw-page.html.twig';
import './sw-page.scss';

const { Component, State, Service } = Shopware;

Component.override('sw-page', {
    template,

    data() {
        return {
            isLoading: false
        }
    },

    computed: {
        currentUser() {
            return State.get('session').currentUser;
        },

        pageClasses() {
            const classes = this.$super('pageClasses');
            classes['has--leave-impersonation-button'] = this.isImpersonating;
            return classes;
        },

        impersonationService() {
            return Service('impersonationService');
        },

        isImpersonating() {
            return this.impersonationService.isImpersonating();
        }

    },

    methods: {
        async leaveImpersonation() {
            this.isLoading = true;

            await this.impersonationService.leaveImpersonation();

            this.isLoading = false;

            if (this.$route.name === 'sw.users.permissions.index') {
                this.$router.go();
            } else {
                this.$router.push({ name: 'sw.users.permissions.index' });
            }
        }
    }
});
