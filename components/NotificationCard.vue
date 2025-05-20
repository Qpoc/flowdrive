<template>
    <a-drawer title="Notifications" placement="right" :closable="false" :open="props.open" @close="emit('close')">
        <a-card v-for="index in 5" :key="index">
            <div class="flex">
                <div class="mt-1">
                    <a-avatar src="https://joeschmoe.io/api/v1/random" />
                </div>
                <div class="ml-2">
                    <div class="text-xl ellipsis" clamp="1">Document Approved</div>
                    <div class="ellipsis" clamp="3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dolorem provident similique expedita pariatur nesciunt adipisci nam, temporibus illo libero.</div>
                </div>
            </div>
            <div class="flex justify-content-end mt-2">
                <a-button size="small" type="primary" danger>Decline</a-button>
                <a-button class="ml-1" size="small" type="primary">Accept</a-button>
            </div>
        </a-card>
    </a-drawer>
</template>

<script setup lang="ts">
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])
</script>