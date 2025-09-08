export interface RequestWithUser extends Express.Request {
    user?: any; // Replace 'any' with the actual user type
}

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    // Add other user properties as needed
}

// URL scanning types
export interface UrlScanRequest {
    url: string;
    visibility?: 'public' | 'unlisted' | 'private';
    tags?: string[];
}

export interface UrlScanSubmitResponse {
    message: string;
    uuid: string;
    result: string; // URL to the result
    api: string; // URL to the API result
    visibility: 'public' | 'unlisted' | 'private';
}

export interface UrlCategory {
    primary: string;
    secondary?: string[];
}

export interface UrlThreatData {
    score: number; // 0-100, higher means more malicious
    malicious: boolean;
    engines: {
        [key: string]: {
            result: 'clean' | 'malicious' | 'suspicious';
            confidence?: number;
        };
    };
}

export interface UrlScanResult {
    url: string;
    finalUrl: string;
    status: 'completed' | 'failed' | 'processing';
    categories: UrlCategory;
    screenshot?: string; // Base64 or URL
    threat: UrlThreatData;
    summary: {
        isSafe: boolean;
        category: string;
        score: number;
    };
}