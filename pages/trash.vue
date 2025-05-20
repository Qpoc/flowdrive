<template>
	<div>
		<a-card v-if="files.length > 0 || folders.length > 0">
			<div class="flex justify-content-between">
				<div>
					Your trash will be deleted after 30 days
				</div>
				<div>
					<a-button type="primary"><delete-outlined /> Empty Trash</a-button>
				</div>
			</div>
		</a-card>
		<div v-else class="flex flex-column align-items-center justify-content-center text-center"
			style="height: 70dvh">
			<delete-filled class="mb-3" style="font-size: 60px;" />
			<a-typography-title>Empty Trash</a-typography-title>
			<a-typography-paragraph>
				Your trash will be deleted after 30 days
			</a-typography-paragraph>
		</div>
		<a-badge-ribbon v-if="folders.length > 0" placement="start" text="Folders">
			<a-card :style="{ backgroundColor: token.colorFillSecondary }" class="mt-3">
				<CardFolder v-if="folders.length > 0" @restore:folder="getTrash" @delete:folder="getTrash"
					:folders="folders" />
			</a-card>
		</a-badge-ribbon>
		<a-badge-ribbon v-if="files.length > 0" placement="start" text="Files">
			<a-card :style="{ backgroundColor: token.colorFillSecondary }" class="mt-3">
				<CardFile v-if="files.length > 0" @restore:file="getTrash" @delete:file="getTrash" :files="files" />
			</a-card>
		</a-badge-ribbon>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["auth"],
})

const { $api } = useNuxtApp();
const token = useTokenColor();


const files = ref([]);
const folders = ref([]);
const getTrash = async () => {
	await $api.user.getTrash().then((res) => {
		files.value = res.files;
		folders.value = res.folders;
	});
}
await getTrash();
</script>

<style></style>