import { defineStore } from 'pinia';

export const useUploadFileStore = defineStore({
	id: 'upload-file',
	state: () => {
		return {
			flow: null,
			files: [],
		};
	},
	actions: {
		setFlow(flow: any) {
			this.flow = flow;
		},
		addFile(file: any) {
			this.files.push(file);
		},
        updateFile(file: any) {
			this.files = this.files.map(flowFile => flowFile.uniqueIdentifier == file.uniqueIdentifier ? file : flowFile);
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUploadFileStore, import.meta.hot));
}
