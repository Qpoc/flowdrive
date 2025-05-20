<template>
    <a-modal :open="props.open" centered :title="`Rename ${title}`" :footer="null" @cancel="emit('close')">
        <a-form ref="renameForm" :model="form" @finish="renameFile">
            <a-form-item name="fileName" :rules="[{ required: true, message: 'File Name is required' }]">
                <a-input v-model:value="form.fileName" placeholder="File Name" show-count :maxlength="255" />
            </a-form-item>
            <a-flex align="end" vertical>
                <a-button type="primary" html-type="submit" :loading="isRenamingFile">Submit</a-button>
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
    fileName: string
}

const form = ref<Form>({
    fileName: '',
});

const myDocumentStore = useMyDocumentStore();
const route = useRoute();

const renameForm = ref<FormInstance>();
const isRenamingFile = ref(false);

const renameFile = async (values: any) => {
    isRenamingFile.value = true;
    $api.file.rename({
        file_id: props.itemId,
        body: {
            name: values.fileName
        }
    }).then(async (res) => {
        useMessage().success(res.message);
        renameForm.value?.resetFields();
        await myDocumentStore.getFolders(route.name === 'folder-id' ? route.params.id : null);
        emit('close');
    }).catch(err => {
        console.log("🚀 ~ renameFile ~ err:", err)
        useMessage().error(err.response._data.message);
    }).finally(() => {
        isRenamingFile.value = false;
    });
}

</script>