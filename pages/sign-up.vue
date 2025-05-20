<template>
	<div class="h-screen flex justify-content-center align-items-center">
		<a-form :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
			<a-card style="width: 300px">
				<a-typography>
					<a-typography-title :level="4">Create an account</a-typography-title>
					<a-typography-paragraph>Sign up with your email and password to get started.</a-typography-paragraph>
				</a-typography>
				<a-form-item name="user" :rules="[{ required: true, message: 'Please input your username!' }]">
					<a-input v-model:value="formState.user" placeholder="Username">
						<template #prefix><UserOutlined class="text-slate-500" /></template>
					</a-input>
				</a-form-item>
				<a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
					<a-input v-model:value="formState.password" type="password" placeholder="Password">
						<template #prefix><LockOutlined class="text-slate-500" /></template>
					</a-input>
				</a-form-item>
				<a-form-item name="confirmPassword" :rules="[{ required: true, message: 'Please input your password!' }]">
					<a-input v-model:value="formState.confirmPassword" type="password" placeholder="Confirm Password">
						<template #prefix><LockOutlined class="text-slate-500" /></template>
					</a-input>
				</a-form-item>
				<a-form-item>
					<a-button class="w-full" type="primary" html-type="submit"> Create an account </a-button>
				</a-form-item>
				<template #actions>
					<NuxtLink :to="{ name: 'index' }"> Log In </NuxtLink>
				</template>
			</a-card>
		</a-form>
	</div>
</template>
<script lang="ts" setup>
definePageMeta({
	layout: 'guest',
	middleware: ["guest"],
});

interface FormState {
	user: string;
	password: string;
	confirmPassword: string;
}
const formState: UnwrapRef<FormState> = reactive({
	user: '',
	password: '',
	confirmPassword: '',
});
const handleFinish: FormProps['onFinish'] = (values) => {
	console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
	console.log(errors);
};
</script>
