export type AdminRole = "admin" | "editor" | "viewer";

export function canEdit(role: AdminRole) {
  return role === "admin" || role === "editor";
}

export function canView(role: AdminRole) {
  return role !== undefined;
}