class User {
  async getUsers(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/user`, {
      method: "GET",
      ...options,
    });
  }
  async getFiles(options: object = {}): Promise<any> {
    const authStore = useAuthStore();
    return use$FetchApi(`v1/user/${authStore.user.id}/file`, {
      method: "GET",
      ...options,
    });
  }
  async getFolders(options: object = {}): Promise<any> {
    const authStore = useAuthStore();
    return use$FetchApi(`v1/user/${authStore.user.id}/folder`, {
      method: "GET",
      ...options,
    });
  }
  async getTrash(options: object = {}): Promise<any> {
    const authStore = useAuthStore();
    return use$FetchApi(`v1/user/${authStore.user.id}/trash`, {
      method: "GET",
      ...options,
    });
  }
}

export default User;
