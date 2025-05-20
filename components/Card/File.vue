<template>
    <dialog-rename-file :open="isRenameFile" :item-id="renamedFile.id" :title="renamedFile.name"
        @close="isRenameFile = false" />
    <dialog-share :open="isSharingFile" @close="isSharingFile = false"/>
    <dialog-move :open="isMovingFile" @close="isMovingFile = false"/>
    <div @contextmenu.prevent>
        <drag-select :draggableOnOption="false" v-model="selectedFiles">
            <a-dropdown :trigger="['contextmenu']">
                <div class="p-4 grid mt-3">
                    <drag-select-option class="col-12 md:col-6 lg:col-4 xl:col-2" v-for="(file, index) in props.files"
                        :key="index" :value="file.id">
                        <a-card class="draggable" :file-id="file.id" :is-selected="selectedFiles.includes(file.id)"
                            @dblclick="viewFile(file)" @contextmenu.prevent="selectedFiles.push(file.id)"
                            @mouseover="file.is_hover = true" @mouseleave="file.is_hover = false"
                            :style="getFileColor(file)">
                            <a-card-meta class="select-none" :title="file.name" :description="file.description">
                                <template #avatar>
                                    <file-filled :style="{ fontSize: '1.5rem' }" />
                                </template>
                            </a-card-meta>
                        </a-card>
                    </drag-select-option>
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="renameFile(selectedFiles)"
                            :disabled="selectedFiles.length != 1 || route.name == 'trash'" key="3"><edit-outlined />
                            Rename</a-menu-item>
                        <a-menu-item @click="downloadFile(selectedFiles)"
                            :disabled="selectedFiles.length <= 0 || route.name == 'trash'" key="1"><download-outlined />
                            Download</a-menu-item>
                        <a-menu-item :disabled="selectedFiles.length <= 0 || route.name == 'trash'" @click="moveFiles(selectedFiles)">
                            <FolderOpenOutlined /> Move
                        </a-menu-item>
                        <a-menu-item @click="shareFile(selectedFiles)">
                            <ShareAltOutlined /> Share
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item @click="deleteFile(selectedFiles)" :disabled="selectedFiles.length <= 0"
                            key="2"><delete-outlined /> Delete   <a-typography-text keyboard>DEL</a-typography-text></a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </drag-select>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['delete:file', 'restore:file', 'update:selectedFiles']);
const props = defineProps({
    files: {
        type: Array,
        default: () => []
    }
});

const { $api } = useNuxtApp();
const myDocumentStore = useMyDocumentStore();

const token = useTokenColor();
const route = useRoute();

const selectedFiles = ref<Array<number>>([]);

watch(selectedFiles, () => {
    myDocumentStore.selectedFiles = Array.from(new Set(selectedFiles.value));
    emit('update:selectedFiles', selectedFiles.value);
});


const getFileColor = (file: File) => {
    if (selectedFiles.value.includes(file.id)) {
        return {
            backgroundColor: token.value.colorPrimary
        }
    }
    if (file.is_hover) {
        return {
            backgroundColor: token.value.colorFillSecondary
        }
    }
}

const isRenameFile = ref(false);
const renamedFile = ref({});
const renameFile = async (file: File) => {
    isRenameFile.value = true;
    renamedFile.value = props.files.find(f => f.id == file);
}


const downloadFile = async (files: File) => {
    const uniqueFiles = Array.from(new Set(files));

    await $api.file.multipleDownload({
        body: {
            file_ids: uniqueFiles
        },
    }).then((res) => {
        const link = document.createElement('a');
        const blob = new Blob([res], { type: 'application/zip' });
        link.href = URL.createObjectURL(blob);
        link.download = 'file.zip';
        link.click();

    }).catch(err => {

    })
}

const deleteFile = async (files: File) => {
    const uniqueFiles = Array.from(new Set(files));
    if (route.name == 'trash') {
        await $api.trash.deleteFile({
            body: {
                file_ids: uniqueFiles
            }
        }).then((res) => {
            useMessage().success('File deleted successfully');
            emit('delete:file', uniqueFiles);
            selectedFiles.value = [];
        }).catch(err => {
            useMessage().error(err.response._data.message);
        })
    } else {
        await $api.file.delete({
            body: {
                file_ids: uniqueFiles
            }
        }).then((res) => {
            useMessage().success('File deleted successfully');
            emit('delete:file', uniqueFiles);
        }).catch(err => {
            useMessage().error(err.response._data.message);
        });
    }

}

const isMovingFile = ref(false);
const moveFiles = (files:any) => {
    isMovingFile.value = true;
    myDocumentStore.selectedFiles = Array.from(new Set(files));
}

const isSharingFile = ref(false);

const shareFile = (files: any) => {
    isSharingFile.value = true;
    myDocumentStore.selectedFiles = Array.from(new Set(files));
}

const restoreFile = async (file: File) => {
    file.is_deleting = true;
    await $api.trash.restoreFile({
        file_id: file.id
    }).then((res) => {
        useMessage().success('File restored successfully');
        emit('restore:file', file);
    }).catch(err => {
        useMessage().error(err.response._data.message);
    }).finally(() => {
        file.is_deleting = false;
    });
}

const router = useRouter();

const viewFile = (file: File) => {
    router.push({ name: 'file-id', params: { id: file.id }, query: { name: file.name } });
}
</script>