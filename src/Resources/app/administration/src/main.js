import './init/impersonation.init';
import './extension/module/sw-users-permissions/components/sw-users-permissions-user-listing';
import './extension/component/structure/sw-page';

const { Module } = Shopware;

Module.register('impersonation', {
    type: 'plugin',
    name: 'Impersonation',
    version: '1.0.0',
    targetVersion: '1.0.0',
});
