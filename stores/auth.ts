import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => {
		return {
			token: null,
			user: null,
		};
	},
	actions: {
		addToken(token: any) {
			this.token = token;
		},
		async fetchUser() {
			try {
				const data  = await use$FetchApi('v1/auth/me', {
					method: 'GET',
				});
				this.user = data;
				return data;
			} catch (error) {
				this.user = null;
				return null;
			}
		},
	},
	getters: {
		getToken: (state) => {
			return state.token;
		},
		getUser: (state) => {
			return state.user;
		},
	},
	persist: true,
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}