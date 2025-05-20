<template>
    <a-modal :open="props.open" title="Move" @cancel="emit('close')" :footer="null" centered>
        <a-form ref="moveForm" v-if="props.open" :model="form" @finish="move">
            <a-form-item name="moveTo" :rules="[{ required: true, message: 'Please select a folder' }]">
                <a-tree-select v-model:value="form.moveTo" tree-data-simple-mode style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData"
                    placeholder="Please select" :load-data="onLoadData" />
            </a-form-item>
            <a-flex align="end" vertical>
                <a-button :loading="isMoving" type="primary" html-type="submit">Submit</a-button>
            </a-flex>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
});

watch(() => props.open, () => {
    if (props.open) {
        form.value.moveTo = null
        treeData.value = [
            {
                id: 'home',
                pId: null,
                value: 'home',
                title: 'Home',
                isLeaf: false,
                disabled: route.name == 'home'
            }
        ]
    }
})

const emit = defineEmits(['close']);

const { $api } = useNuxtApp();
const route = useRoute();

const myDocumentStore = useMyDocumentStore();

const form = ref({
    moveTo: null
});

const moveForm = ref<FormInstance>();

const selectedFiles = computed(() => {
    return Array.from(new Set(myDocumentStore.selectedFiles));
});

const selectedFolders = computed(() => {
    return Array.from(new Set(myDocumentStore.selectedFolders));
});

const isMoving = ref(false);
const move = async (value: any) => {
    isMoving.value = true;
    await $api.folder.move({
        body: {
            folder_id: value.moveTo == 'home' ? null : value.moveTo,
            folder_ids: selectedFolders.value,
            file_ids: selectedFiles.value
        }
    }).then(async (res) => {
        useMessage().success(res.message);
        moveForm.value?.resetFields();
        emit('close');
        await myDocumentStore.getFolders(route?.params?.id)
    }).catch(err => {
        useMessage().error(err.response._data.message);
    }).finally(() => {
        isMoving.value = false;
    });
};

let treeData = ref<TreeSelectProps['treeData']>([]);

const onLoadData = async (treeNode: TreeSelectProps['treeData'][number]) => {
    const { id } = treeNode.dataRef;

    if (id == 'home') {
        await $api.user.getFolders().then((res) => {
            treeData.value = treeData.value?.concat(res.map((folder: Folder) => {
                return {
                    id: folder.id,
                    pId: 'home',
                    value: folder.id,
                    title: folder.name,
                    isLeaf: folder.is_leaf,
                    disabled: selectedFolders.value.includes(folder.id) || route.params.id == folder.id
                }
            }))
        })
    } else {
        await $api.folder.getFolders({ folder_id: id }).then((res) => {
            treeData.value = treeData.value.concat(
                res.map((folder: Folder) => {
                    return {
                        id: folder.id,
                        pId: folder.parent_id,
                        value: folder.id,
                        title: folder.name,
                        isLeaf: folder.is_leaf,
                        disabled: selectedFolders.value.includes(folder.id) || route.params.id == folder.id
                    }
                })
            );
        });
    }


};
</script>