import { addToast } from "@heroui/react";

export class AlertService {
    static default(title: string, message: string) {
        addToast({
            title: title,
            description: message,
            variant: "flat",
            color: "default",
        });
    }
    static success(title: string, message: string) {
        addToast({
            title: title,
            description: message,
            variant: "flat",
            color: "success",
        });
    }
    static error(title: string, message: string) {
        addToast({
            title: title,
            description: message,
            variant: "flat",
            color: "danger",
        });
    }
    static warning(title: string, message: string) {
        addToast({
            title: title,
            description: message,
            variant: "flat",
            color: "warning",
        });
    }
}