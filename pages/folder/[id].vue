<template>
    <div>
        <div v-if="errorStatus >= 400 && errorStatus < 500">
            <a-result status="404" title="404 Not Found" sub-title="Sorry, the page you visited does not exist.">
                <template #extra>
                    <NuxtLink :to="{ name: 'home' }"><a-button type="primary">Back Home</a-button></NuxtLink>
                </template>
            </a-result>
        </div>
        <div v-else>
            <dialog-create-folder :open="isCreateFolder" @close="isCreateFolder = false" />
            <a-card>
                <!-- <a-space>
                    <a-breadcrumb-item>
                        <NuxtLink :to="{ name: 'home' }">Home </NuxtLink>
                    </a-breadcrumb-item>
                    <div v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                        <span v-if="index < breadcrumbs.length - 1">
                            <NuxtLink :style="{ color: '#000' }" v-if="index < breadcrumbs.length - 1"
                                :to="{ name: 'folder-id', params: { id: breadcrumb.id }, query: { name: breadcrumb.name } }">
                                {{
                                    breadcrumb.name }}</NuxtLink>
                        </span>
                        <span v-if="index < breadcrumbs.length - 1">
                            /
                        </span>
                        <a-typography-text strong :style="{ color: token.colorPrimary }" v-else>{{ breadcrumb.name
                                }}</a-typography-text>
                    </div>
                </a-space> -->
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <NuxtLink :to="{ name: 'home' }">Home</NuxtLink>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" class="dropzone" :key="index">
                        <NuxtLink v-if="index < breadcrumbs.length - 1"
                            :to="{ name: 'folder-id', params: { id: breadcrumb.id }, query: { name: breadcrumb.name } }">
                            {{
                                breadcrumb.name }}</NuxtLink>
                        <a-typography-text strong :style="{ color: token.colorPrimary }" v-else>{{ breadcrumb.name
                            }}</a-typography-text>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </a-card>
            <div id="flow" @dragleave.prevent="isDragEnter = false" @drop.prevent="isDragEnter = false"
                @dragenter.prevent="dragEnter" @dragover="dragEnter" class="w-full mt-5"
                :class="{ 'border-dashed border-primary': isDragEnter }">
                <div>
                    <a-badge-ribbon v-show="folders.length > 0" placement="start" text="My Folders" class="select-none">
                        <a-card :style="{ backgroundColor: token.colorFillSecondary }">
                            <CardFolder @delete:folder="getFolders" :folders="folders"
                                @update:selected-folders="(folders) => selectedFolders = folders" />
                        </a-card>
                    </a-badge-ribbon>
                </div>
                <div class="mt-3">
                    <a-badge-ribbon v-show="files.length > 0" placement="start" text="My Files" class="select-none">
                        <a-card :style="{ backgroundColor: token.colorFillSecondary }">
                            <CardFile @delete:file="getFolders" :files="files"
                                @update:selected-files="(files) => selectedFiles = files" />
                        </a-card>
                    </a-badge-ribbon>
                </div>
                <div v-show="files.length <= 0 && folders.length <= 0">
                    <a-empty
                        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                        :image-style="{
                            height: '60px',
                        }" class="mt-5">
                        <template #description>
                            <span>
                                Start by uploading your
                                <a-typography-text strong :style="{ color: token.colorPrimary }">first
                                    document</a-typography-text>
                            </span>
                        </template>
                        <a-button @click="isCreateFolder = true" class="mx-1">
                            <FolderAddOutlined /> Create Folder
                        </a-button>
                        <a-button @click="uploadFile" class="mx-1">
                            <FileAddOutlined /> Upload File
                        </a-button>
                        <a-button @click="uploadFolder" class="mx-1">
                            <FolderOutlined /> Upload Folder
                        </a-button>
                    </a-empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import interact from 'interactjs';

definePageMeta({
    middleware: ["auth"],
});

const { $api } = useNuxtApp();

const token = useTokenColor();
const fileStore = useUploadFileStore();
const flow = useFlow();
const isDragEnter = ref(false);

const route = useRoute();
const myDocumentStore = useMyDocumentStore();

const folder = ref({});
const folders = computed(() => {
    return myDocumentStore.folders
});
const files = computed(() => {
    return myDocumentStore.files
});

const isCreateFolder = ref(false);
const breadcrumbs = ref([]);

const errorStatus = ref(0);

const getFolder = async () => {

    await $api.folder.show({ folder_id: route.params.id }).then(async (res) => {
        folder.value = res
        await getBreadcrumbs();
        await getFolders();
    }).catch(err => {
        errorStatus.value = err.response.status;
    })

}

const getFolders = async () => {
    await myDocumentStore.getFolders(route.params.id)
}

const getBreadcrumbs = async () => {
    return await $api.folder.breadcrumbs({ folder_id: route.params.id }).then((res) => {
        breadcrumbs.value = res
    });
}

await getFolder();

/**
 * Flow
 */

const uploadFile = () => {
    document.getElementById('uploadFileBtn')?.click();
};

const uploadFolder = () => {
    document.getElementById('uploadFolderBtn')?.click();
};


//end

/**
 * Interact
 */
let initialPosition = ref({ x: 0, y: 0 });

const selectedFolders = ref([]);
const selectedFiles = ref([]);

onMounted(() => {
    interact('.draggable')
        .draggable({
            // Enable inertia for smoother drag effect
            inertia: true,
            listeners: {
                start(event) {
                    // Capture the initial position when dragging starts
                    const target = event.target;
                    initialPosition.value = {
                        x: parseFloat(target.getAttribute('data-x')) || 0,
                        y: parseFloat(target.getAttribute('data-y')) || 0
                    };

                    if (!selectedFolders.value.includes(parseInt(target.getAttribute('folder-id'))) && !isNaN(parseInt(target.getAttribute('folder-id')))) {
                        selectedFolders.value.push(parseInt(target.getAttribute('folder-id')));
                    }

                    if (!selectedFiles.value.includes(parseInt(target.getAttribute('file-id'))) && !isNaN(parseInt(target.getAttribute('file-id')))) {
                        console.log("🚀 ~ start ~ parseInt(target.getAttribute('file-id')):", parseInt(target.getAttribute('file-id')))
                        selectedFiles.value.push(parseInt(target.getAttribute('file-id')));
                    }

                    target.style.zIndex = '9999'
                    target.style.backgroundColor = token.value.colorPrimary

                    document.querySelectorAll('[is-selected="true"]').forEach((element) => {
                        if (element.getAttribute('folder-id') != target.getAttribute('folder-id') || element.getAttribute('file-id') != target.getAttribute('file-id')) {
                            element.classList.remove('dropzone')
                            element.style.backgroundColor = token.value.colorFillSecondary
                        }
                    });
                },
                move(event) {
                    const { target } = event;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                },
                end(event) {
                    // After dragging ends, return the element to its initial position
                    const target = event.target;
                    // Apply smooth transition to return the element to its original position
                    target.style.transition = 'transform 0.5s ease'; // Smooth transition
                    target.style.transform = `translate(${initialPosition.value.x}px, ${initialPosition.value.y}px)`;
                    target.setAttribute('data-x', initialPosition.value.x);
                    target.setAttribute('data-y', initialPosition.value.y);

                    setTimeout(() => {
                        target.style.transition = '';
                    }, 500)

                    target.style.zIndex = '0'

                    document.querySelectorAll('[is-selected="true"]').forEach((element) => {
                        if (element.getAttribute('folder-id') != target.getAttribute('folder-id') || element.getAttribute('file-id') != target.getAttribute('file-id')) {
                            element.classList.add('dropzone')
                        }
                    });
                }
            },
        }).styleCursor(false);

    /* The dragging code for '.draggable' from the demo above
* applies to this demo as well so it doesn't have to be repeated. */

    // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '.draggable',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.25,

        // listen for drop related events:

        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            const draggableElement = event.relatedTarget
            const dropzoneElement = event.target

            // feedback the possibility of a drop
            draggableElement.style.backgroundColor = token.value.colorPrimary
            dropzoneElement.style.backgroundColor = token.value.colorFill
        },
        ondragleave: function (event) {
            const draggableElement = event.relatedTarget
            const dropzoneElement = event.target

            // remove the drop feedback style
            draggableElement.style.backgroundColor = token.value.colorPrimary
            dropzoneElement.style.backgroundColor = ''
        },
        ondrop: async function (event) {
            const draggableElement = event.relatedTarget
            const dropzoneElement = event.target

            draggableElement.style.backgroundColor = token.value.colorPrimary
            dropzoneElement.style.backgroundColor = ''

            await $api.folder.move({
                body: {
                    folder_id: dropzoneElement.getAttribute('folder-id'),
                    folder_ids: selectedFolders.value,
                    file_ids: selectedFiles.value
                }
            }).then(async (res) => {
                useMessage().success(res.message);

                await getFolders();
            }).catch(err => {
                useMessage().error(err.response._data.message);
            })
        },
        ondropdeactivate: function (event) {

        }
    })
});

onBeforeUnmount(() => {
    // Remove previous interact.js instances to avoid duplicates
    interact('.draggable').unset();
    interact('.dropzone').unset();
});

//end
</script>