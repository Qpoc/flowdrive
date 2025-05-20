<template>
    <div class="unidrive-uploads overflow-auto" v-if="data[0]">
        <a-card class="unidrive-upload-card" size="small" :body-style="{ padding: '0px' }">
            <a-card :body-style="{ padding: '0.5rem' }" class="unidrive-upload-card-header" :bordered="false">
                <div class="flex justify-content-between align-items-center">
                    <div class="flex flex-column">
                        <a-typography-title :level="5">Upload</a-typography-title>
                        <div v-if="fileStore.flow.timeRemaining() >= 60">
                            {{$dayjs.duration(fileStore.flow.timeRemaining()/60, "minutes").humanize()}} remaining
                        </div>
                        <div v-else-if="fileStore.flow.timeRemaining() > 0">
                            {{fileStore.flow.timeRemaining()}} seconds remaining
                        </div>
                    </div>
                    <a-button type="text" @click="isMinimize = !isMinimize">
                        <DownOutlined v-if="!isMinimize" />
                        <UpOutlined v-else />
                    </a-button>
                </div>
            </a-card>

            <a-list v-if="!isMinimize" item-layout="horizontal" :data-source="data">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-tooltip>
                            <template #title>{{ item.name }}</template>
                            <div class="ellipsis" clamp="1">
                                <a-progress v-if="!item.isCanceled" type="circle" trail-color="#e6f4ff" :percent="item.progress() * 100" :stroke-width="20" :size="24" :show-info="false" />
                                {{ item.name }}
                            </div>
                        </a-tooltip>
                        <template #actions>
                            <div v-if="!item.isCanceled && !(item.progress() >= 1)">
                                <a-tooltip>
                                    <template #title> {{ item.paused ? 'Resume' : 'Pause' }} </template>
                                    <a-button @click="pause(item)" size="small" type="text">
                                        <PauseCircleOutlined v-if="!item.paused" />
                                        <PlayCircleOutlined v-else />
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip>
                                    <template #title> Cancel </template>
                                    <a-button @click="cancel(item)" size="small" type="text">
                                        <CloseCircleOutlined />
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <div v-else-if="item.isCanceled" class="flex align-content-center">Upload canceled</div>
                            <div v-else-if="item.progress() >= 1" class="flex align-content-center">Completed</div>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
    </div>
</template>

<script setup lang="ts">
const isMinimize = ref<boolean>(false);
const fileStore = useUploadFileStore();

const pause = (file: any) => {
	if (file.paused) {
		file.resume();
	} else {
		file.pause();
	}
};
const cancel = (file: any) => {
	file.isCanceled = true;
	fileStore.flow.removeFile(file);
	fileStore.updateFile(file);
};

const data = computed(() => {
	return fileStore.files;
});
</script>