import type { FieldError } from 'react-hook-form';

// JSON.stringify(error) will not work because of circular references. So we need this helper function.
export const formatErrors = (errors: Record<string, FieldError>) =>
    Object.keys(errors).map(key => ({
        key,
        message: errors[key]?.message ?? "Unknown error"
    }));

export type AlertType = "error" | "success" | "warning";

export type AlertMode = 'modal' | 'page';