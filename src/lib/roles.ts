export const PLANTS = ["MP2", "LIO", "SAOB"] as const;
export type Plant = (typeof PLANTS)[number];

export const USER_ROLES = [
  "admin",
  "user",
  "mp2-admin-user",
  "lio-admin-user",
  "saob-admin-user",
  "mp2-view-only",
  "lio-view-only",
  "saob-view-only",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

const ROLE_PLANT_MAP: Record<UserRole, Plant | null> = {
  admin: null,
  user: null,
  "mp2-admin-user": "MP2",
  "lio-admin-user": "LIO",
  "saob-admin-user": "SAOB",
  "mp2-view-only": "MP2",
  "lio-view-only": "LIO",
  "saob-view-only": "SAOB",
};

export function getRolePlant(role?: string | null): Plant | null {
  if (!role) return null;
  if (role in ROLE_PLANT_MAP) {
    return ROLE_PLANT_MAP[role as UserRole];
  }
  return null;
}

export function isGlobalAdmin(role?: string | null): role is "admin" {
  return role === "admin";
}

export function isPlantAdminRole(role?: string | null): boolean {
  return (
    role === "mp2-admin-user" ||
    role === "lio-admin-user" ||
    role === "saob-admin-user"
  );
}

export function isViewOnlyRole(role?: string | null): boolean {
  return (
    role === "mp2-view-only" ||
    role === "lio-view-only" ||
    role === "saob-view-only"
  );
}

export function canViewPlant(role: string | null | undefined, plant: Plant): boolean {
  if (isGlobalAdmin(role)) return true;
  const scopedPlant = getRolePlant(role);
  return scopedPlant === plant;
}

export function canManagePlant(role: string | null | undefined, plant: Plant): boolean {
  if (isGlobalAdmin(role)) return true;
  if (!isPlantAdminRole(role)) return false;
  const scopedPlant = getRolePlant(role);
  return scopedPlant === plant;
}

export function getAllowedPlants(role: string | null | undefined): Plant[] {
  if (isGlobalAdmin(role)) return [...PLANTS];
  const scopedPlant = getRolePlant(role);
  return scopedPlant ? [scopedPlant] : [];
}

export function isPlantValue(value: string): value is Plant {
  return (PLANTS as readonly string[]).includes(value);
}
