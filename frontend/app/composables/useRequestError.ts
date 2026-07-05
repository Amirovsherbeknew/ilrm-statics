import { ElMessageBox } from "element-plus";
import { useNuxtApp } from "#app";
interface ErrorMessage {
  key?: string;
  messages: string[];
  icon_type?: "warning" | "error" | "info"; // Можно добавить другие типы
  show: boolean;
}

interface ResponseError {
  status?: number;
  _data?: { show: boolean; key: string; messages: string[];error:string, icon_type: "warning" | "error" | "info" };
  message?: string;
}
export const useRequestError = () => {
  const errorMessages = new Map([
    [401, "wasAnError"],
    [400, "wasAnError"],
    // [403, "wasAnError"],
    [404, "dataNotFound"],
  ]);

  function catchingError(response: any) {
    if (!response || !response.status) return;
    const errorMessageKey = errorMessages.get(response.status);
    if (!errorMessageKey) return;

    const messageText = Array.isArray(response._data)
      ? response._data?.[0]?.messages?.[0]
      : (response._data as any)?.message;

    if (!messageText) return;

    ElMessageBox.alert(messageText, {
      cancelButtonText: "Yopish",
      closeOnClickModal: true,
      customClass: "el-custom-message",
      showCancelButton: true,
      showConfirmButton: false,
      type: 'error',
      center: true,
    })
    
    ;
  }

  return { catchingError };
};
