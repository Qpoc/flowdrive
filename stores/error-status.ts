import { defineStore } from "pinia";

export const useErrorStatusStore = defineStore({
	id: 'error-status',
	state: () => ({
		status: 0,
	}),
	actions: {
		setStatus(status: number) {
            this.status = status
		},
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useErrorStatusStore, import.meta.hot));
}