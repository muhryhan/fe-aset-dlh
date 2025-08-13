type Permission = "create" | "read" | "update" | "delete";

const RESOURCES = [
  "kendaraan",
  "alatBerat",
  "alatKerja",
  "ac",
  "tanah",
  "tanaman",
  "tanamanMasuk",
  "tanamanKeluar",
  "servisAc",
  "servisKendaraan",
  "servisAlatBerat",
  "servisAlatKerja",
  "serberAc",
  "serberKendaraan",
  "serberAlatBerat",
  "serberAlatKerja",
] as const;

const FULL_ACCESS: Permission[] = ["create", "read", "update", "delete"];
const LIMITED_ACCESS: Permission[] = ["create", "read"];

const createAccessMap = (permissions: Permission[]) =>
  Object.fromEntries(RESOURCES.map((res) => [res, permissions]));

export const ACL = {
  kepalaDinas: createAccessMap(FULL_ACCESS),
  bendahara: createAccessMap(FULL_ACCESS),
  admin: createAccessMap(LIMITED_ACCESS),
};
