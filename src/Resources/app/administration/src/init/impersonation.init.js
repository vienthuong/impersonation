import { IMPERSONATING_ATTRIBUTE_KEY } from '../constant/impersonation.constant';
import ImpersonationService from '../service/impersonation.service';

const { State, Application } = Shopware;
const initContainer = Application.getContainer('init');
const currentUser = State.get('session').currentUser;
const httpClient = initContainer.httpClient;

Application.addServiceProvider('impersonationService', (container) => {
    return new ImpersonationService(currentUser, container, httpClient);
});
