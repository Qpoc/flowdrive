export const useFetchApi = async (url: string, options: object) => {
  const auth = useAuthStore();
  options = {
    ...options,
    headers: {
      skip_zrok_interstitial: true,
      Authorization: `Bearer ${auth.getToken}`,
      Accept: "application/json",
    },
  };
  return await useFetch(
    `${useRuntimeConfig().public.API_URL}/api/${url}`,
    options
  );
};

export const use$FetchApi = async (url: string, options: object) => {
  const auth = useAuthStore();
  options = {
    ...options,
    headers: {
      skip_zrok_interstitial: true,
      Authorization: `Bearer ${auth.getToken}`,
      Accept: "application/json",
    },
  };
  return await $fetch(
    `${useRuntimeConfig().public.API_URL}/api/${url}`,
    options
  );
};

export const useLazyFetchApi = async (url: string, options: object) => {
  const auth = useAuthStore();
  options = {
    ...options,
    headers: {
      skip_zrok_interstitial: true,
      Authorization: `Bearer ${auth.getToken}`,
      Accept: "application/json",
    },
  };
  return await useLazyFetch(
    `${useRuntimeConfig().public.API_URL}/api/${url}`,
    options
  );
};
