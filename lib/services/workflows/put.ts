import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";

export async function updateWorkflowStatus(workflowId: String, status: 'running'|'stopped'): Promise<boolean> {
    const response = await clientV1.put(`/workflows/${workflowId}/${status}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.status == 200;
} 	
