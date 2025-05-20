<template>
    <a-modal :open="props.open" centered :footer="null" @cancel="emit('close')">
        <a-flex vertical>
            <a-card size="small" :bordered="false" title="Share Document" style="box-shadow: none;">
                <a-space direction="vertical" style="width: 100%;">
                    <a-space-compact style="width: 100%;">
                        <a-input v-model:value="documentUrl" :readonly="true" />
                        <a-tooltip title="Copy">
                            <a-button @click="copyUrl(documentUrl)">
                                <CopyOutlined />
                            </a-button>
                        </a-tooltip>
                    </a-space-compact>
                </a-space>
                <div v-if="selectedFiles.length == 1" v-for="(file) in selectedFiles" :key="file.id"
                    class="flex  align-items-center mt-3"
                    :class="file.link_type == 1 ? 'justify-content-between' : 'justify-content-end'">
                    <a-select v-model:value="file.access_type" v-if="file.link_type == 1" :default-value="1"
                        @change="shareFilePublic([file.id], file.link_type, file.access_type)">
                        <a-select-option :value="1">Editor</a-select-option>
                        <a-select-option :value="2">Viewer</a-select-option>
                    </a-select>
                    <a-radio-group v-model:value="file.link_type"
                        @change="shareFilePublic([file.id], file.link_type, file.access_type)" :default-value="2"
                        size="small" class="flex justify-content-end">
                        <a-radio-button :value="1">Public</a-radio-button>
                        <a-radio-button :value="2">Private</a-radio-button>
                    </a-radio-group>
                </div>
                <div v-else v-for="(file) in selectedFiles" :key="file.id" class="mt-3">
                    <a-card>
                        <div class="flex align-items-center justify-content-between">
                            <p>{{ file.name }}</p>
                            <div v-if="file.link_type == 1">
                                <a-select v-model:value="file.access_type" :default-value="1"
                                    @change="shareFilePublic([file.id], file.link_type, file.access_type)">
                                    <a-select-option :value="1">Editor</a-select-option>
                                    <a-select-option :value="2">Viewer</a-select-option>
                                </a-select>
                            </div>
                        </div>
                        <div class="flex align-items-center justify-content-between mt-2">
                            <div>
                                <a-tooltip title="Copy">
                                    <a-button
                                        @click="copyUrl(useRuntimeConfig().public.APP_URL + routeShare.path.replace(':id()', file.shared_link.id))">
                                        <CopyOutlined />
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-radio-group v-model:value="file.link_type"
                                @change="shareFilePublic([file.id], file.link_type, file.access_type)" default-value="2"
                                size="small">
                                <a-radio-button :value="1">Public</a-radio-button>
                                <a-radio-button :value="2">Private</a-radio-button>
                            </a-radio-group>
                        </div>
                    </a-card>
                </div>
            </a-card>

            <a-card size="small" :bordered="false" title="Invite Other" style="box-shadow: none;">
                <a-space direction="vertical" style="width: 100%;">
                    <a-space-compact style="width: 100%;">
                        <a-select v-model:value="state.value" mode="multiple" label-in-value placeholder="Enter email"
                            style="width: 100%" :filter-option="false"
                            :not-found-content="state.fetching ? undefined : null" :options="state.data"
                            @search="fetchUser">
                            <template v-if="state.fetching" #notFoundContent>
                                <a-spin size="small" />
                            </template>
                        </a-select>
                        <a-tooltip title="Invite Other">
                            <a-button @click="inviteUser">
                                <UserAddOutlined /> Invite
                            </a-button>
                        </a-tooltip>
                    </a-space-compact>
                </a-space>
            </a-card>
            <a-card size="small" :bordered="false" title="Team Members" style="box-shadow: none;">
                <a-list :loading="initLoading" item-layout="horizontal" :data-source="list">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <template #actions>
                                <a-dropdown :trigger="['click']">
                                    <a-button>
                                        Editor
                                        <DownOutlined />
                                    </a-button>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item>
                                                <a href="javascript:;">Editor</a>
                                            </a-menu-item>
                                            <a-menu-item>
                                                <a href="javascript:;">Viewer</a>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </template>
                            <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                                <a-list-item-meta :description="item.email">
                                    <template #title>
                                        <a href="https://www.antdv.com/">{{ item.name.first }} {{ item.name.last
                                            }}</a>
                                    </template>
                                    <template #avatar>
                                        <a-avatar :src="item.picture.large" />
                                    </template>
                                </a-list-item-meta>
                            </a-skeleton>
                        </a-list-item>
                    </template>
                    <template #loadMore>
                        <div v-if="!initLoading && !loading"
                            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                            <a-button @click="onLoadMore"> Load More </a-button>
                        </div>
                    </template>
                </a-list>
            </a-card>
        </a-flex>
    </a-modal>
</template>

<script setup lang="ts">

const emit = defineEmits(['close']);

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
})

const { $api } = useNuxtApp();
const router = useRouter();
const routeShare = router.options.routes.find(route => route.name == 'share-file-id');
const myDocumentStore = useMyDocumentStore();

const selectedFiles = ref([]);
watch(() => props.open, async (val) => {
    if (val) {
        documentUrl.value = '';
        await $api.file.getFiles({
            body: {
                file_ids: myDocumentStore.selectedFiles
            }
        }).then(async (res) => {
            const countSharing = res.data.length;
            const routeShare = router.options.routes.find(route => route.name == 'share-file-id');

            selectedFiles.value = res.data.map((file: File, index: any) => {
                if (file.shared_link) {
                    documentUrl.value += useRuntimeConfig().public.APP_URL + routeShare.path.replace(':id()', file.shared_link.id);
                    documentUrl.value += countSharing > 0 && index < countSharing - 1 ? ', ' : '';
                }
                return {
                    ...file,
                    access_type: file.shared_link?.access_type ?? 1,
                    link_type: file.shared_link?.link_type ?? 2
                }
            });
            const noShareFile = res.data.filter((file: File) => !file.shared_link).map((file: File) => file.id);
            if (noShareFile.length > 0) {
                await shareFilePublic(noShareFile, 2);
            }
        })
    }
});


const documentUrl = ref('');

const shareFilePublic = async (files, linkType, accessType = null) => {
    if (myDocumentStore.selectedFiles.length == 1) {
        documentUrl.value = '';
    }
    accessType = linkType == 2 ? null : accessType;
    await $api.file.share({
        body: {
            file_ids: files,
            link_type: linkType,
            access_type: accessType
        }
    }).then((res) => {
        const routeShare = router.options.routes.find(route => route.name == 'share-file-id');

        const countSharing = res.data.length;

        documentUrl.value += documentUrl.value != '' ? ', ' : '';

        res.data.forEach((fileShare: any, index: any) => {
            documentUrl.value += useRuntimeConfig().public.APP_URL + routeShare.path.replace(':id()', fileShare.id);
            documentUrl.value += (countSharing > 0 && index < countSharing - 1) ? ', ' : '';
        });
    });

}

const token = useTokenColor();

const copyUrl = async (text: string) => {
    try {
        if (!navigator.clipboard) {
            console.warn('Clipboard API not supported, falling back to legacy method.');
            fallbackCopyToClipboard(text);
            return;
        }
        await navigator.clipboard.writeText(text);
        useMessage().success('Copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
};

const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        useMessage().success('Copied to clipboard');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
};

//test invite 

const value = ref('');

const dataSource = ref([]);

//test Other Members

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const initLoading = ref(true);
const loading = ref(false);
const data = ref([]);
const list = ref([]);
onMounted(() => {
    fetch(fakeDataUrl)
        .then(res => res.json())
        .then(res => {
            initLoading.value = false;
            data.value = res.results;
            list.value = res.results;
            dataSource.value = res.results.map(item => {
                return {
                    value: item.email
                }
            });
        });
});


const onLoadMore = () => {
    loading.value = true;
    list.value = data.value.concat(
        [...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })),
    );
    fetch(fakeDataUrl)
        .then(res => res.json())
        .then(res => {
            const newData = data.value.concat(res.results);
            dataSource.value.push(...res.results.map(item => {
                return {
                    value: item.email
                }
            }));
            loading.value = false;
            data.value = newData;
            list.value = newData;
            console.log("🚀 ~ onLoadMore ~ dataSource:", dataSource.value)
            nextTick(() => {
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
        });
};


//invite team members

let lastFetchId = 0;

const state = ref({
    data: [],
    value: [],
    fetching: false,
});

const isSearching = ref(null);

const fetchUser = (text) => {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    state.value.data = [];
    state.value.fetching = true;

    if (isSearching.value) {
        clearTimeout(isSearching.value);
    }

    isSearching.value = setTimeout(() => {
        $api.user.getUsers({
            query: {
                search: text
            }
        }).then((res) => {
            state.value.data = res.data.map((item) => {
                return {
                    label: item.email,
                    value: item.id
                }
            });
        }).catch(err => {
            useMessage().error(err.response._data.message);
        }).finally(() => {
            state.value.fetching = false;
        });
    }, 500);
};

const inviteUser = () => {
    console.log("🚀 ~ inviteUser ~ state.value.value:", state.value.value);
    $api.share.invite({
        body: {
            invites: state.value.value.map((item) => {
                return {
                    user_id: item.value,
                    file_ids: myDocumentStore.selectedFiles
                }
            })
        }
    }).then((res) => {
        useMessage().success(res.message);
        emit('close');
    }).catch(err => {
        useMessage().error(err.response._data.message);
    });
}
</script>