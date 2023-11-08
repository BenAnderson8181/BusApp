import type { AlertType, AlertMode } from "./form";

// Global alert div.
export default function Alert({ children, type }: { children: React.ReactNode; type: AlertType }) {
    return (
        <div
            className={`bg-${type}-100 border-l-4 border-${type}-500 text-${type}-700 p-4`}
            role="alert"
        >
            <p className="font-bold">{type}</p>
            <p>{children}</p>
        </div>
    );
}

export const AlertInput = ({ children, type, mode = 'page' }: { children: React.ReactNode; type: AlertType, mode?: AlertMode }) =>
    Boolean(children) ? (
        <span className={`text-${type}-700 ${mode === 'modal' ? 'text-red-400' : 'text-yellow-300'} block text-xl`} >{children}</span>
    ) : null;