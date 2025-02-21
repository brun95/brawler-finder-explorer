
import { Trophy } from "lucide-react";

interface StatCardProps {
    icon: typeof Trophy;
    label: string;
    value: number | string;
}

export const StatCard = ({
    icon: Icon,
    label,
    value,
}: StatCardProps) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-600">{label}</span>
        </div>
        <p className="text-xl font-semibold">{value}</p>
    </div>
);
