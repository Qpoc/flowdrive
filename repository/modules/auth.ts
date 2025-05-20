class Auth {
  async login(options: object = {}): Promise<any> {
    return use$FetchApi("v1/auth/login", {
      method: "POST",
      ...options,
    });
  }

  async logout(): Promise<any> {
    return use$FetchApi("v1/auth/logout", {
      method: "POST",
    });
  }
}

export default Auth;
