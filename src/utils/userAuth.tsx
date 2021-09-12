import { createContext, useContext } from 'react';

export class Auth {
  get isAuthenticated(): boolean {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    return !!(email && password);
  }

  private static validateEmail(target: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(target);
  }

  login(email: string, password: string): boolean {
    if (!Auth.validateEmail(email)) return false;

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    return true;
  }

  logout(): void {
    localStorage.clear();
  }
}


export const AuthContext = createContext<Auth>(new Auth());
export const UserAuth = () => useContext(AuthContext);