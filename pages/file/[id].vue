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
            <DocumentEditor id="docEditor" class="w-full flex justify-content-center align-items-center flex-grow-1"
                :height="'900'" :documentServerUrl="`${useRuntimeConfig().public.ONLYOFFICE_SERVER_URL}`"
                :config="config" :events_onDocumentReady="onDocumentReady"
                :onLoadComponentError="onLoadComponentError" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { DocumentEditor } from '@onlyoffice/document-editor-vue';

definePageMeta({
    middleware: ["auth"],
});

const { $api } = useNuxtApp();
const auth = useAuthStore();
const route = useRoute();

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

const errorStatus = ref(null);
const url = ref('');

await $api.file.getSignedUrl({
    file_id: route.params.id
}).then(async (res) => {
    url.value = res.data.value.url;
}).catch(err => {
    console.log("🚀 ~ err:", err)

});

await $api.file.show({
    file_id: route.params.id
}).then(async (res) => {

    if (res.status.value == 'error') {
        errorStatus.value = res.error.value.statusCode;
    }

    let documentType = '';

    if (res.data.value.name.split('.').pop() == 'docx') {
        documentType = 'word';
    } else if (res.data.value.name.split('.').pop() == 'pdf') {
        documentType = 'pdf';
    } else if (res.data.value.name.split('.').pop() == 'xlsx') {
        documentType = 'cell';
    } else if (res.data.value.name.split('.').pop() == 'pptx') {
        documentType = 'slide';
    }

    const key = `${res.data.value.id.toString()}-${generateUUID()}`;

    config.value = {
        document: {
            fileType: res.data.value.name.split('.').pop(),
            key: res.data.value.uuid,
            url: url.value,
            title: res.data.value.name,
            permissions: {
                edit: true, // Necessary for review access
                review: true, // Enable review permissions
                download: true,
                print: true,
                protect: true
            },
        },
        documentType: documentType,
        editorConfig: {
            callbackUrl: useRuntimeConfig().public.ONLYOFFICE_CALLBACK_URL,
            user: {
                name: auth?.user?.name,
            }
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

})


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