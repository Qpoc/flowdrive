<template>
    <a-modal :open="props.open" centered :title="`Rename ${title}`" :footer="null" @cancel="emit('close')">
        <a-form ref="renameForm" :model="form" @finish="renameFolder">
            <a-form-item name="folderName" :rules="[{ required: true, message: 'Folder Name is required' }]">
                <a-input v-model:value="form.folderName" placeholder="Folder Name" show-count :maxlength="255" />
            </a-form-item>
            <a-flex align="end" vertical>
                <a-button type="primary" html-type="submit" :loading="isRenamingFolder">Submit</a-button>
            </a-flex>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';

const props = defineProps({
    itemId: {
        type: [String, Number],
        default: null,
    },
    open: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    }
});
const emit = defineEmits(['close']);

const { $api } = useNuxtApp();

interface Form {
    folderName: string
}

const form = ref<Form>({
    folderName: '',
});

const myDocumentStore = useMyDocumentStore();
const route = useRoute();

const renameForm = ref<FormInstance>();
const isRenamingFolder = ref(false);

const renameFolder = async (values: any) => {
    isRenamingFolder.value = true;
    $api.folder.rename({
        folder_id: props.itemId,
        body: {
            name: values.folderName
        }
    }).then(async (res) => {
        useMessage().success(res.message);
        renameForm.value?.resetFields();
        await myDocumentStore.getFolders(route.name === 'folder-id' ? route.params.id : null);
        emit('close');
    }).catch(err => {
        console.log("🚀 ~ renameFolder ~ err:", err)
        useMessage().error(err.response._data.message);
    }).finally(() => {
        isRenamingFolder.value = false;
    });
}

</script>