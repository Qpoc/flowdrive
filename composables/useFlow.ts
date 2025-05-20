import Flow from "@flowjs/flow.js";

export const useFlow = (options = {}) => {
  return new Flow({
    target: useRuntimeConfig().public.API_URL + "/api/v1/upload",
    method: "POST",
    testChunks: false,
    simultaneousUploads: 1,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${useAuthStore().getToken}`,
    },
    ...options,
  });
};
