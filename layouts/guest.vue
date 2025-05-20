<template>
	<a-config-provider :theme="{
		algorithm: theme.defaultAlgorithm,
		token: {
			colorPrimary: '#FAAF00',
		},
	}">
		<!-- <a-extract-style> -->
		<div class="h-screen">
			<NuxtPage />
		</div>
		<!-- </a-extract-style> -->
	</a-config-provider>
</template>
<script setup lang="ts">
import { theme } from 'ant-design-vue';
</script>
