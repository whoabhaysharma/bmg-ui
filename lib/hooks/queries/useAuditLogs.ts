import { useQuery } from '@tanstack/react-query';
import { auditLogsAPI } from '@/lib/api/client';

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    userId: string;
    userName: string;
    createdAt: string;
}

export function useAuditLogsQuery(params?: { gymId?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['auditLogs', params],
        queryFn: async () => {
            const response = await auditLogsAPI.getAll(params);
            // response.data is the body. sendSuccess wraps data in 'data' field.
            return response.data?.data || [];
        },
    });
}
