import { useNuxtApp } from "#app";
import {useMainStore} from '../../store/index'
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  [key: string]: any;
}

type IUseFetch<T> = Promise<{
  data: Ref<T | null>;
  pending: Ref<boolean>;
  error: Ref<any>;
  refresh: () => Promise<void>;
}>;

const defaultHeaders: Record<string, string> = {
  'Accept-language':'uz'
};

const request = async <T>(
  url: string,
  options: RequestOptions = {}
): IUseFetch<T> => {
  const mainStore = useMainStore()
  const config = useRuntimeConfig();
  const baseURL =config.public?.apiBase;
  const router = useRouter();
  const { getAccessToken, clearTokens,getUserId } = useToken();
  const { catchingError } = useRequestError();

  const token = getAccessToken();
 
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  else {
    delete defaultHeaders.Authorization
  }
  
  try {
    mainStore.handleLoading(true);
    const response = await useFetch<T>(baseURL + url, {
      ...options,
      watch: false,
      cache:'no-cache',
      key: String(Date.now()),
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      params: {
        ...clean(options?.params?.value || options?.params || {}),
      },
      onResponseError({ response }) {
         if (response.status === 401) {
          clearTokens();
          useCookie('access_token').value = null
          useCookie('refresh_token').value = null
          router.push("/login");
          return
        }
        catchingError(response);
        throw response;
      },
    });

    return response as any;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  } finally {
    mainStore.handleLoading(false);
  }
};

export const useFetchApi = {
  get: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "POST", body, ...options }),

  put: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "PUT", body, ...options }),

  patch: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "PATCH", body, ...options }),

  delete: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { method: "DELETE", ...options }),
};
