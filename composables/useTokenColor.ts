import { theme } from "ant-design-vue";

export const useTokenColor = () => {
  const { useToken } = theme;
  const { token } = useToken();
  return token;
};
