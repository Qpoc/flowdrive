<template>
	<NuxtLoadingIndicator :color="token.colorPrimary" />
	<a-config-provider :theme="{
		algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
		token: {
			colorPrimary: '#FAAF00',
		},
	}">
		<div class="unidrive-layout">
			<a-layout class="min-h-screen layout">
				<a-card size="small">
					<div class="flex justify-content-between">
						<div class="text-3xl">UniDrive</div>
						<a-space :size="24">
							<a>
								<a-badge @click="open = true" :count="1">
									<a-avatar shape="square">
										<template #icon>
											<BellOutlined />
										</template>
									</a-avatar>
								</a-badge>
							</a>

							<a-dropdown>
								<template #overlay>
									<a-menu>
										<a-menu-item @click="changeTheme" key="1"> Dark Mode </a-menu-item>
										<a-menu-item @click="logout" key="2"> Log Out </a-menu-item>
									</a-menu>
								</template>
								<a>
									<a-badge>
										<a-avatar shape="square">
											<template #icon>
												<UserOutlined />
											</template>
										</a-avatar>
									</a-badge>
								</a>
							</a-dropdown>
						</a-space>
					</div>
				</a-card>
				<a-layout>
					<a-layout-sider>
						<uni-menu />
					</a-layout-sider>

					<a-layout-content :style="{ padding: '24px', margin: 0, minHeight: '280px' }">
						<NuxtPage style="padding: 1rem" />
					</a-layout-content>
				</a-layout>
			</a-layout>

			<notification-card @close="open = false" :open="open" />
			<upload-progress />
		</div>
		<button hidden id="uploadFileBtn"></button>
		<button hidden id="uploadFolderBtn"></button>
	</a-config-provider>
</template>
<script setup lang="ts">
import { theme } from 'ant-design-vue';

const { $api } = useNuxtApp();

const token = useTokenColor();
const route = useRoute();

/**
 * Uploading of file
 */

const myDocumentStore = useMyDocumentStore();

watch(route, () => {
	myDocumentStore.selectedFiles = [];
	myDocumentStore.selectedFolders = [];
});

const getFiles = async () => {
	await myDocumentStore.getFiles()
};

let flow = useFlow();

onMounted(() => {
	const fileStore = useUploadFileStore();
	fileStore.setFlow(flow);

	if (route.name == 'folder-id' || route.name == 'home') {
		flow.assignDrop(document.getElementById('flow'));
	}
	flow.assignBrowse(document.getElementById('uploadFileBtn'));
	flow.assignBrowse(document.getElementById('uploadFolderBtn'), true);

	flow.on('fileAdded', function (file: any, event: any) {
		fileStore.addFile(file);
		if (route.name == 'folder-id') {
			flow.opts.query.folder_id = route.params.id
		}
		setTimeout(() => {
			flow.upload();
		}, 1000);
	});

	flow.on('fileProgress', function (file: any) {
		fileStore.updateFile(file);
	});

	flow.on('fileSuccess', async function (file: any, message: any) {
		console.log(file, message);
		if (route.name == 'folder-id') {
			await myDocumentStore.getFolders(route.params.id);
		} else {
			await getFiles();
		}
	});
	flow.on('fileError', function (file: any, message: any) {
		console.log(file, message);
	});
});

/**
 * TODO: Implement Delete Key
 */

const handleDelete = (e:any) => {
	if (e.key == 'Delete') {
		myDocumentStore.selectedFolders;
		console.log("🚀 ~ document.addEventListener ~ selectedFolders:", myDocumentStore.selectedFolders)
		myDocumentStore.selectedFiles;
		console.log("🚀 ~ document.addEventListener ~ myDocumentStore.selectedFiles:", myDocumentStore.selectedFiles)
	}
}
onMounted(() => {
	document.addEventListener('keydown', handleDelete)
});

onBeforeMount(() => {
	document.removeEventListener('keydown', handleDelete)
})

const logout = async () => {
	await $api.auth.logout();
	reloadNuxtApp();
};

const isDark = ref(false);
const changeTheme = () => {
	isDark.value = !isDark.value;
};

const open = ref<boolean>(false);

const onClose = () => {
	open.value = false;
};
</script>

<style>
* {
	padding: 0;
	margin: 0;
}

html,
body {
	position: relative;
}

div.ellipsis[clamp='1'] {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

div.ellipsis[clamp='3'] {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.unidrive-uploads {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	width: 350px;
	max-height: 150px;
}

.unidrive-upload-card-header {
	position: sticky;
	top: 0;
	z-index: 1;
}
</style>
