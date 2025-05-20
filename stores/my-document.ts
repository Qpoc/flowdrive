import { defineStore } from "pinia";

export const useMyDocumentStore = defineStore({
	id: 'my-document',
	state: () => ({
		files: [],
		folders: [],
		selectedFiles: [],
		selectedFolders: [],
	}),
	actions: {
		async getFiles() {
			const {$api} = useNuxtApp();
			await $api.user.getFiles().then((res) => {
				this.files = res;
			})
		},
		async getFolders(folderId = null) {
			const {$api} = useNuxtApp();
			if (folderId) {
				let files = []
				let folders = []
				await $api.folder.getFiles({ folder_id: folderId }).then((res) => {
					files = res;
				})
				await $api.folder.getFolders({ folder_id: folderId }).then((res) => {
					folders = res;
				})

				this.files = files;
				this.folders = folders;
			}else {
				await $api.user.getFolders().then((res) => {
					this.folders = res;
				})

				await this.getFiles();
			}
		},

		setSelectedFiles(files) {
			this.selectedFiles = files
		},

		setSelectedFolders(folders) {
			this.selectedFolders = folders
		}
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMyDocumentStore, import.meta.hot));
}