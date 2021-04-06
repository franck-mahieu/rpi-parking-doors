const env = process.env.NODE_ENV;
const reactAppDevApiUrl = process.env.REACT_APP_DEV_API_URL;

export const getBaseUrl = (
  envParam: string | undefined,
  reactAppApiUrlParam: string | undefined,
) => {
  return envParam === 'development' ? reactAppApiUrlParam : '';
};

export const fetchUtils = async (uri: string, method: string, body?: any) => {
  const response = await fetch(`${getBaseUrl(env, reactAppDevApiUrl)}${uri}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: env === 'development' ? 'include' : 'same-origin',
    body: body,
  });
  const result: any = await response.json();
  if (
    (response.status >= 200 && response.status < 300) ||
    (result?.changes && result.changes !== 0)
  ) {
    return result;
  }
  return Promise.reject(result);
};
