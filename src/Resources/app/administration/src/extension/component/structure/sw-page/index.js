import template from './sw-page.html.twig';
import './sw-page.scss';
import initializeUserContext from 'src/app/init-post';
import { IMPERSONATING_ATTRIBUTE_KEY } from '../../../../constant/impersonation.constant';

const { Component } = Shopware;

Component.override('sw-page', {
    template,

    computed: {
        pageClasses() {
            const classes = this.$super('pageClasses');
            classes['has--leave-impersonation-button'] = this.isImpersonating;
            return classes;
        },

        isImpersonating() {
            return !!localStorage.getItem(IMPERSONATING_ATTRIBUTE_KEY);
        }
    },

    methods: {
        async leaveImpersonation() {
            localStorage.removeItem(IMPERSONATING_ATTRIBUTE_KEY);

            await initializeUserContext.userInformation();

            if (this.$route.name === 'sw.users.permissions.index') {
                this.$router.go();
            } else {
                this.$router.push({ name: 'sw.users.permissions.index' });
            }
        }
    }
});
