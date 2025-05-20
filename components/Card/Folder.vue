<template>
    <dialog-rename-folder :open="isRenameFolder" :item-id="renamedFolder.id" :title="renamedFolder.name" @close="isRenameFolder = false" />
    <dialog-move :open="isMovingFolder" @close="isMovingFolder = false" />
    <div @contextmenu.prevent>
        <drag-select :draggableOnOption="false" v-model="selectedFolders">
            <a-dropdown :trigger="['contextmenu']">
                <div class="p-4 grid mt-3">
                    <drag-select-option v-for="(folder, index) in props.folders" :key="index" :value="folder.id"
                        class="col-12 md:col-6 lg:col-4 xl:col-2">
                        <a-card class="draggable dropzone" :folder-id="folder.id"
                            :is-selected="selectedFolders.includes(folder.id)"
                            @contextmenu.prevent="selectedFolders.push(folder.id)" @dblclick="viewFolder(folder)"
                            @mouseover="folder.is_hover = true" @mouseleave="folder.is_hover = false"
                            :style="getFolderColor(folder)">
                            <a-card-meta class="select-none" :title="folder.name" :description="folder.description">
                                <template #avatar>
                                    <folder-filled style="font-size: 1.5rem;" />
                                </template>
                            </a-card-meta>
                        </a-card>
                    </drag-select-option>
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="renameFolder(selectedFolders)" :disabled="selectedFolders.length != 1 || route.name == 'trash'"
                            key="3"><edit-outlined />
                            Rename</a-menu-item>
                        <a-menu-item :disabled="selectedFolders.length <= 0 || route.name == 'trash'"
                            key="1"><download-outlined />
                            Download</a-menu-item>
                        <a-menu-item :disabled="selectedFolders.length <= 0 || route.name == 'trash'" @click="moveFolder(selectedFolders)">
                            <FolderOpenOutlined /> Move
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item @click="deleteFolder(selectedFolders)" :disabled="selectedFolders.length <= 0"
                            key="2"><delete-outlined /> Delete</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </drag-select>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['delete:folder', 'restore:folder', 'update:selectedFolders']);

const { $api } = useNuxtApp();
const myDocumentStore = useMyDocumentStore();

const route = useRoute();

const token = useTokenColor();

const props = defineProps({
    folders: {
        type: Array,
        default: () => []
    }
});

const selectedFolders = ref([]);

watch(selectedFolders, () => {
    myDocumentStore.selectedFolders = [...new Set(selectedFolders.value)];
    emit('update:selectedFolders', selectedFolders.value);
});

const getFolderColor = (folder: Folder) => {
    if (selectedFolders.value.includes(folder.id)) {
        return {
            backgroundColor: token.value.colorPrimary
        }
    }
    if (folder.is_hover) {
        return {
            backgroundColor: token.value.colorFillSecondary
        }
    }
}

const isRenameFolder = ref(false);
const renamedFolder = ref({});
const renameFolder = (folder: File) => {
    isRenameFolder.value = true;
    renamedFolder.value = props.folders.find(f => f.id == folder);
}

const isMovingFolder = ref(false);
const moveFolder = (folders: any) => {
    isMovingFolder.value = true;
    myDocumentStore.selectedFolders = Array.from(new Set(folders));
}

const deleteFolder = async (folders: Folder) => {
    folders = [...new Set(folders)];
    if (route.name == 'trash') {
        await $api.trash.deleteFolder({
            body: {
                folder_ids: folders
            }
        }).then((res) => {
            useMessage().success('Folder deleted successfully');
            emit('delete:folder', folders);
            selectedFolders.value = [];
        }).catch(err => {
            useMessage().error(err.response._data.message);
        })
    } else {
        await $api.folder.delete({
            body: {
                folder_ids: folders
            }
        }).then((res) => {
            useMessage().success('Folder deleted successfully');
            emit('delete:folder', folders);
            selectedFolders.value = [];
        }).catch(err => {
            useMessage().error(err.response._data.message);
        })
    }
}

const restoreFolder = async (folder: Folder) => {
    folder.is_deleting = true;
    await $api.trash.restore({
        folder_id: folder.id
    }).then((res) => {
        useMessage().success('Folder restored successfully');
        emit('restore:folder', folder);
    }).catch(err => {
        useMessage().error(err.response._data.message);
    }).finally(() => {
        folder.is_deleting = false;
    });
}

const router = useRouter();

const viewFolder = (folder: Folder) => {
    router.push({ name: 'folder-id', params: { id: folder.id }, query: { name: folder.name } });
}

const downloadFolder = async (folder: Folder) => {
    folder.is_downloading = true;
    await $api.folder.download({
        folder_id: folder.id
    }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', folder.name);
        link.click();
    }).catch(err => {
        useMessage().error(err.response._data.message);
    }).finally(() => {
        folder.is_downloading = false;
    });
}

</script>
<style>
.draggable-box {
    width: 100px;
    height: 100px;
    background-color: #42b983;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
}
</style>