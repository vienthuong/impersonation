<?php declare(strict_types=1);

namespace VienThuong\Impersonation\Service;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Uuid\Uuid;

class Impersonate implements CanImpersonate
{
    public const IMPERSONATING_ATTRIBUTE_KEY = 'impersonated-user-id';
    public const IMPERSONATING_PRIVILEGE = 'permissions.impersonating';

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @var string
     */
    private $impersonatedUserIdentifier;

    /**
     * @var string
     */
    private $impersonatedUserId;

    /**
     * @var string
     */
    private $impersonatingUserId;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function setImpersonatingUserId(string $impersonatingUserId): void
    {
        $this->impersonatingUserId = $impersonatingUserId;
    }

    public function setImpersonatedUserIdentifier(string $impersonatedUserIdentifier): void
    {
        $this->impersonatedUserIdentifier = $impersonatedUserIdentifier;
    }

    /**
     * @return string
     */
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
            ->execute()
            ->fetch();

        $this->impersonatedUserId = $user ? Uuid::fromBytesToHex($user['id']) : null;
    }

    public function canImpersonate(): bool
    {
        $this->resolveImpersonatedUser();

        if (!$this->impersonatedUserId || !$this->impersonatingUserId) {
            return false;
        }

        if ($this->isAdmin($this->impersonatingUserId) || $this->hasPrivilege()) {
            return true;
        }

        return false;
    }

    private function hasPrivilege(): bool
    {
        // TODO: check if user has impersonation Privilidges
        return false;
    }

    private function isAdmin(string $userId): bool
    {
        return (bool) $this->connection->fetchColumn(
            'SELECT admin FROM `user` WHERE id = :id',
            ['id' => Uuid::fromHexToBytes($userId)]
        );
    }
}
