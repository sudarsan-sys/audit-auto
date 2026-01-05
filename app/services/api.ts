import axios from 'axios';

// Ensure this matches your backend URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Data Types
export interface AuditResult {
    filename: string;
    score: number;
    status: string;
    summary: string;
    risks: string[];
    recommendations: string[];
}

export interface ChatResponse {
    question: string;
    answer: string;
    sources?: {
        filename: string;
        score: number;
        status: string;
    };
}

// Axios Instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const auditService = {
    // 1. Upload and Audit a File
    uploadFile: async (file: File): Promise<AuditResult> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post<AuditResult>('/audit-file/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Audit Upload Error:", error);
            throw error;
        }
    },

    // 2. Chat with the Document
    askQuestion: async (question: string): Promise<ChatResponse> => {
        try {
            // Sending question as a query parameter
            const response = await api.get<ChatResponse>(`/ask/`, {
                params: { question }
            });
            return response.data;
        } catch (error) {
            console.error("Chat Error:", error);
            throw error;
        }
    }
};