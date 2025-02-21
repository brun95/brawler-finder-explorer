
import { Trophy } from "lucide-react";

interface StatRowProps {
    icon: typeof Trophy;
    label: string;
    value: number | string;
}

export const StatRow = ({
    icon: Icon,
    label,
    value,
}: StatRowProps) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <span>{label}</span>
        </div>
        <span className="font-medium">{value}</span>
    </div>
);
