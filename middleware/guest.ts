export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();
  const user = await auth.fetchUser();
  if (user) {
    return navigateTo({ name: "home" });
  }
});
