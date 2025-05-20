<template>
	<div class="min-h-full">
		<dialog-create-folder :open="isCreateFolder" @close="isCreateFolder = false" />
		<div class="flex flex-column align-items-center">
			<a-typography>
				<a-typography-title :level="4" strong>Welcome to <span
						:style="{ color: token.colorPrimary }">UniDrive</span></a-typography-title>
			</a-typography>
			<a-input style="max-width: 800px" placeholder="Search Document">
				<template #prefix>
					<SearchOutlined class="text-slate-500" />
				</template>
			</a-input>
		</div>
		<div id="flow" @dragleave.prevent="isDragEnter = false" @drop.prevent="isDragEnter = false"
			@dragenter.prevent="dragEnter" @dragover="dragEnter" class="w-full mt-5"
			:class="{ 'border-dashed border-primary': isDragEnter }">
			<div>
				<a-badge-ribbon v-show="folders.length > 0" placement="start" text="My Folders" class="select-none">
					<a-card :style="{ backgroundColor: token.colorFillSecondary }">
						<CardFolder @delete:folder="getFolders" :folders="folders" @update:selected-folders="(folders) => selectedFolders = folders"/>
					</a-card>
				</a-badge-ribbon>
			</div>
			<div class="mt-3">
				<a-badge-ribbon v-show="files.length > 0" placement="start" text="My Files" class="select-none">
					<a-card :style="{ backgroundColor: token.colorFillSecondary }">
						<CardFile @delete:file="getFiles" :files="files" @update:selected-files="(files) => selectedFiles = files"/>
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
</template>
<script lang="ts" setup>
import interact from 'interactjs';

/**
 * Initilization
 */
definePageMeta({
	middleware: ['auth'],
});

const myDocumentStore = useMyDocumentStore();
const token = useTokenColor();
const fileStore = useUploadFileStore();
const flow = useFlow();
const isDragEnter = ref(false);
const { $api } = useNuxtApp();

const isCreateFolder = ref(false);
const dragEnter = () => {
	isDragEnter.value = true;
};

const getFiles = async () => {
	await myDocumentStore.getFiles()
};

const files = computed(() => {
	return myDocumentStore.files
});

const getFolders = async () => {
	await myDocumentStore.getFolders()
};

const folders = computed(() => {
	return myDocumentStore.folders
});

await getFiles();
await getFolders();
//end

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
				await getFiles();
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
<style scoped></style>
