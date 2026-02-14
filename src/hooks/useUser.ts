import { useState, useCallback, useEffect } from "react";

const COOKIE_NAME = "quest-designer-user";
const USERS_KEY = "quest-designer-users";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function loadUsers(): string[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: string[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useUser() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => getCookie(COOKIE_NAME));
  const [users, setUsers] = useState<string[]>(loadUsers);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCookie(COOKIE_NAME, trimmed);
    setCurrentUser(trimmed);
    setUsers((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const logout = useCallback(() => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setCurrentUser(null);
  }, []);

  return { currentUser, users, login, logout };
}
