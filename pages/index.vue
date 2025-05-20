<template>

	<div class="h-screen flex justify-content-center align-items-center">
		<a-form :model="formState" @finish="handleFinish">
			<a-card style="width: 300px">

				<a-typography>
					<a-typography-title :level="4">Log in</a-typography-title>
					<a-typography-paragraph>Access your account with your username and
						password.</a-typography-paragraph>
				</a-typography>

				<a-form-item name="user" :rules="[{ required: true, message: 'Please input your username!' }]">
					<a-input v-model:value="formState.user" placeholder="Username">
						<template #prefix>
							<UserOutlined class="text-slate-500" />
						</template>
					</a-input>
				</a-form-item>
				<a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
					<a-input v-model:value="formState.password" type="password" placeholder="Password">
						<template #prefix>
							<LockOutlined class="text-slate-500" />
						</template>
					</a-input>
				</a-form-item>
				<a-form-item>
					<div>
						<a-button :loading="isLoggingIn" class="w-full" type="primary" html-type="submit"> Log in
						</a-button>
					</div>
				</a-form-item>
				<template #actions>
					<NuxtLink :to="{ name: 'sign-up' }"> Create an account </NuxtLink>
				</template>
			</a-card>
		</a-form>
	</div>
</template>
<script lang="ts" setup>

const { $api } = useNuxtApp()

definePageMeta({
	layout: 'guest',
	middleware: ['guest']
});

const router = useRouter();
const auth = useAuthStore();

interface FormState {
	user: string;
	password: string;
}
const formState: UnwrapRef<FormState> = reactive({
	user: '',
	password: '',
});

const isLoggingIn = ref(false);

const handleFinish: FormProps['onFinish'] = async (values) => {
	isLoggingIn.value = true;
	await $api.auth.login({
		body: {
			email: values.user,
			password: values.password,
		}
	}).then((res) => {
		
		auth.addToken(res.token);
		if (res) {
			router.push({ name: 'home' });
		}
	}).catch(err => {
		useMessage().error(err.response._data.message);
	}).finally(() => {
		isLoggingIn.value = false;
	})

};
</script>
