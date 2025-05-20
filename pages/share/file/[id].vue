<template>
    <div v-if="errorStatus >= 400 && errorStatus < 500">
        <a-result status="404" title="404 Not Found" sub-title="Sorry, the page you visited does not exist.">
            <template #extra>
                <NuxtLink :to="{ name: 'home' }"><a-button type="primary">Back Home</a-button></NuxtLink>
            </template>
        </a-result>
    </div>
    <div v-else>
        <DocumentEditor id="docEditor" class="w-full flex justify-content-center align-items-center flex-grow-1"
            :height="'900'" :documentServerUrl="`${useRuntimeConfig().public.ONLYOFFICE_SERVER_URL}`" :config="config"
            :events_onDocumentReady="onDocumentReady" :onLoadComponentError="onLoadComponentError" />
    </div>
</template>
<script setup lang="ts">
import { DocumentEditor } from '@onlyoffice/document-editor-vue';

definePageMeta({
    layout: 'guest',
})

const { $api } = useNuxtApp();

const auth = useAuthStore();
const options = {
    method: "GET",
    headers: {
        skip_zrok_interstitial: true,
        Authorization: `Bearer ${auth.getToken}`,
        Accept: "application/json",
    },
};

const errorStatus = ref(200);
const route = useRoute();
const share = ref(null);

const config = ref({
    document: {
        fileType: 'docx',
        key: '1',
        title: '2',
        url: '3'
    },
    documentType: 'word',
});

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

await $api.share.show({
    share_id: route.params.id
}).then(async (fileShare) => {
    console.log("🚀 ~ fileShare:", fileShare)
    await $fetch(`${fileShare.data.link}&verify=1`).then(async (res) => {
        share.value = fileShare.data;

        let documentType = '';

        if (share.value.file.name.split('.').pop() == 'docx') {
            documentType = 'word';
        } else if (share.value.file.name.split('.').pop() == 'pdf') {
            documentType = 'pdf';
        } else if (share.value.file.name.split('.').pop() == 'xlsx') {
            documentType = 'cell';
        } else if (share.value.file.name.split('.').pop() == 'pptx') {
            documentType = 'slide';
        }

        const key = `${share.value.file.id.toString()}-${generateUUID()}`;

        config.value = {
            document: {
                fileType: share.value.file.name.split('.').pop(),
                key: share.value.file.uuid,
                url: share.value.link,
                title: share.value.file.name,
                permissions: {
                    edit: fileShare.data.access_type == 1, // Necessary for review access
                    review: fileShare.data.access_type == 1, // Enable review permissions
                    download: fileShare.data.access_type == 1 || fileShare.data.access_type == 2,
                    print: fileShare.data.access_type == 1 || fileShare.data.access_type == 2,
                    protect: fileShare.data.access_type == 1 || fileShare.data.access_type == 2,
                    comment: fileShare.data.access_type == 1 || fileShare.data.access_type == 2
                },
            },
            documentType: documentType,
            editorConfig: {
                callbackUrl: useRuntimeConfig().public.ONLYOFFICE_CALLBACK_URL,
            },
        }

        await $api.onlyoffice.generateToken({
            body: {
                config: config.value
            }
        }).then((res) => {
            config.value.token = res;
        })
    }).catch(err => {
        errorStatus.value = err.status
    });
}).catch(err => {
    errorStatus.value = err.status
});

const onDocumentReady = () => {
    console.log('Document is loaded');
};

const onLoadComponentError = (errorCode, errorDescription) => {
    switch (errorCode) {
        case -1: // Unknown error loading component
            console.log(errorDescription);
            break;

        case -2: // Error load DocsAPI from http://documentserver/
            console.log(errorDescription);
            break;

        case -3: // DocsAPI is not defined
            console.log(errorDescription);
            break;
    }
};
</script>