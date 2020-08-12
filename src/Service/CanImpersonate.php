<?php declare(strict_types=1);

namespace VienThuong\Impersonation\Service;

interface CanImpersonate
{
    public function canImpersonate(): bool;
    public function setImpersonatedUserIdentifier(string $impersonatedUserIdentifier): void;
    public function setImpersonatingUserId(string $impersonatingUserId): void;
    public function resolveImpersonatedUser();
}
