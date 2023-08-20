<?php declare(strict_types=1);

namespace VienThuong\Impersonation\Service;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Uuid\Uuid;

class Impersonate implements CanImpersonate
{
    final public const IMPERSONATING_ATTRIBUTE_KEY = 'impersonated-user-id';
    final public const IMPERSONATING_PRIVILEGE = 'permissions.impersonating';

    private ?string $impersonatedUserIdentifier = null;

    private ?string $impersonatedUserId = null;

    private ?string $impersonatingUserId = null;

    public function __construct(private readonly Connection $connection)
    {
    }

    public function setImpersonatingUserId(string $impersonatingUserId): void
    {
        $this->impersonatingUserId = $impersonatingUserId;
    }

    public function setImpersonatedUserIdentifier(string $impersonatedUserIdentifier): void
    {
        $this->impersonatedUserIdentifier = $impersonatedUserIdentifier;
    }

    public function getImpersonatedUserId(): string
    {
        return $this->impersonatedUserId;
    }

    public function resolveImpersonatedUser(): void
    {
        $builder = $this->connection->createQueryBuilder();

        $user = $builder->select(['user.id'])
            ->from('user')
            ->where('id = :id')
            ->setParameter('id', Uuid::fromHexToBytes($this->impersonatedUserIdentifier))
            ->executeQuery()
            ->fetchAssociative();

        $this->impersonatedUserId = $user ? Uuid::fromBytesToHex($user['id']) : null;
    }

    public function canImpersonate(): bool
    {
        $this->resolveImpersonatedUser();

        if (!$this->impersonatedUserId || !$this->impersonatingUserId) {
            return false;
        }
        return $this->isAdmin($this->impersonatingUserId) || $this->hasPrivilege();
    }

    private function hasPrivilege(): bool
    {
        // TODO: check if user has impersonation Privileges
        return false;
    }

    private function isAdmin(string $userId): bool
    {
        return (bool) $this->connection->fetchFirstColumn(
            'SELECT admin FROM `user` WHERE id = :id',
            ['id' => Uuid::fromHexToBytes($userId)]
        );
    }
}
