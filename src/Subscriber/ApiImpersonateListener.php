<?php declare(strict_types=1);

namespace VienThuong\Impersonation\Subscriber;

use VienThuong\Impersonation\Service\CanImpersonate;
use VienThuong\Impersonation\Service\Impersonate;
use Shopware\Core\Framework\Routing\KernelListenerPriorities;
use Shopware\Core\Framework\Routing\RouteScopeCheckTrait;
use Shopware\Core\Framework\Routing\RouteScopeRegistry;
use Shopware\Core\PlatformRequest;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiImpersonateListener implements EventSubscriberInterface
{
    use RouteScopeCheckTrait;

    public function __construct(
        private readonly CanImpersonate $impersonateService,
        private readonly RouteScopeRegistry $routeScopeRegistry
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => [
                ['impersonate', KernelListenerPriorities::KERNEL_CONTROLLER_EVENT_CONTEXT_RESOLVE_PRE],
            ],
        ];
    }

    public function impersonate(ControllerEvent $event): void
    {
        $request = $event->getRequest();

        $impersonatedUserIdentifier = $request->headers->get(Impersonate::IMPERSONATING_ATTRIBUTE_KEY);

        if (!$request->attributes->get('auth_required', true) || !$impersonatedUserIdentifier) {
            return;
        }

        $this->impersonateService->setImpersonatingUserId($request->attributes->get(PlatformRequest::ATTRIBUTE_OAUTH_USER_ID));
        $this->impersonateService->setImpersonatedUserIdentifier($impersonatedUserIdentifier);

        if (!$this->impersonateService->canImpersonate()) {
            return;
        }

        $request->attributes->set(PlatformRequest::ATTRIBUTE_OAUTH_USER_ID, $this->impersonateService->getImpersonatedUserId());
    }

    protected function getScopeRegistry(): RouteScopeRegistry
    {
        return $this->routeScopeRegistry;
    }
}
