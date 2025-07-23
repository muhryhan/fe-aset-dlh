import {ACL} from "../config/acl";

type Role = keyof typeof ACL;
type Resource = keyof (typeof ACL)[Role];
type Action = "create" | "read" | "update" | "delete";

export function hakAkses(
  role: Role,
  resource: Resource,
  action: Action
): boolean {
  return ACL[role]?.[resource]?.includes(action) ?? false;
}
