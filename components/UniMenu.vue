<template>
	<dialog-create-folder :open="isCreateFolder" @close="isCreateFolder = false" />
	<a-menu :selectedKeys="selectedKeys2" :openKeys="openKeys" :style="{ height: '100%', borderRight: 0 }">
		<a-menu-item>
			<UserOutlined /> {{ user.name }}
		</a-menu-item>
		<a-divider />
		<a-sub-menu key="New">
			<template #title>
				<span>
					<PlusOutlined />
					New
				</span>
			</template>

			<a-menu-item @click="isCreateFolder = true">
				<FolderAddOutlined />
				Create Folder
			</a-menu-item>
			<a-menu-item @click="uploadFolder">
				<FolderOutlined />
				Upload Folder
			</a-menu-item>
			<a-menu-item @click="uploadFile">
				<FileOutlined />
				Upload File
			</a-menu-item>
		</a-sub-menu>
		<a-menu-item @click="
			router.push({ name: 'home' });
		selectedKeys2 = ['home'];
		" key='home'>
			<HomeOutlined /> Home
		</a-menu-item>
		<a-menu-item @click="
			router.push({ name: 'my-unidrive' });
		selectedKeys2 = ['my-unidrive'];
		" key="my-unidrive">
			<FolderOutlined /> My UniDrive
		</a-menu-item>
		<a-menu-item @click="
			router.push({ name: 'shared-unidrive' });
		selectedKeys2 = ['shared-unidrive'];
		" key="shared-unidrive">
			<FolderOpenOutlined /> Shared UniDrive
		</a-menu-item>
		<a-menu-item @click="
			router.push({ name: 'trash' });
		selectedKeys2 = ['trash'];
		" key="trash">
			<DeleteOutlined /> Trash
		</a-menu-item>
	</a-menu>
</template>
<script setup lang="ts">

const isCreateFolder = ref<boolean>(false);

/**
 * Authenticated User
 */
const authStore = useAuthStore();
const user = computed(() => {
	return authStore.user;
});

// End

/**
 * Menu
 */

const route = useRoute();
const selectedKeys2 = ref<string[]>([route.name]);
const openKeys = ref<string[]>(['sub1']);
const router = useRouter();

watch(route, () => {
	selectedKeys2.value = [route.name];
});

// End

/**
 * Upload of file and folder
 */
const uploadFile = () => {
	document.getElementById('uploadFileBtn')?.click();
};

const uploadFolder = () => {
	document.getElementById('uploadFolderBtn')?.click();
};

// End
</script>