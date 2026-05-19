import { jwtDecode } from "jwt-decode";

export function getTokenPayload() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function getUsuarioId() {
  const payload = getTokenPayload();
  return payload?.id;
}

export function getUsuarioRole() {
  const payload = getTokenPayload();
  return payload?.role;
}
