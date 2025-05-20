<template>
    <a-modal :open="props.open" centered title="New Folder" :footer="null" @cancel="emit('close')">
        <a-form ref="folderForm" :model="form" @finish="createFolder">
            <a-form-item name="folderName" :rules="[{ required: true, message: ' Folder Name is required' }]">
                <a-input v-model:value="form.folderName" placeholder="Folder Name" show-count :maxlength="255" />
            </a-form-item>
            <a-flex align="end" vertical>
                <a-button type="primary" html-type="submit" :loading="isCreatingFolder">Submit</a-button>
            </a-flex>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';

/**
 * Initialization
 */
const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);

const myDocumentStore = useMyDocumentStore();

const { $api } = useNuxtApp();

const route = useRoute();

//end

/**
 * Form handling creationg of folder
 */
const isCreatingFolder = ref<boolean>(false);

interface Form {
    folderName: string;
}

const folderForm = ref<FormInstance>();

const form = ref<Form>({
    folderName: '',
});

const createFolder = async (values: any) => {
    isCreatingFolder.value = true;
    const payload = {
        folder_name: values.folderName,
        parent_folder_id: route.name === 'folder-id' ? route.params.id : null
    }
    await $api.folder.create({
        body: payload,
    }).then(async (res) => {
        useMessage().success(res.message);
        emit('close');
        folderForm.value?.resetFields();
        await myDocumentStore.getFolders(route.name === 'folder-id' ? route.params.id : null);
    }).catch(err => {
        useMessage().error(err.response._data.message);
    }).finally(() => {
        isCreatingFolder.value = false;
    });
};
</script>