const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface InventoryAnalysisResult {
  [key: string]: number;
}

export interface TestInventoryResponse {
  message: string;
  updated_items: Array<{
    name: string;
    count: number;
    total_added: number;
    current_quantity: number;
  }>;
  report_id: number;
  filename: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  total_added: number;
  total_sold: number;
  current_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  response: string;
  context_summary?: {
    net_gain_total: number;
    waste_loss_total: number;
    top_seller: string;
    low_seller: string;
    optimize_more: string[];
    cut_back: string[];
  };
}

export interface BusinessProfile {
  name: string;
  location: string;
  type: string;
  hours: string;
  goals: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  async analyzeImage(image: File): Promise<InventoryAnalysisResult> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/analyze-image/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to analyze image",
        response.status
      );
    }

    return data;
  },

  async sendTestInventoryData(): Promise<TestInventoryResponse> {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log

    if (!token) {
      throw new ApiError("No authentication token found");
    }

    console.log("Making request to:", `${API_BASE_URL}/test-inventory-data/`); // Debug log
    console.log("Headers:", {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }); // Debug log

    const response = await fetch(`${API_BASE_URL}/test-inventory-data/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status); // Debug log
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    ); // Debug log

    const data = await response.json();
    console.log("Response data:", data); // Debug log

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to send test inventory data",
        response.status
      );
    }

    return data;
  },

  async getInventoryItems(): Promise<InventoryItem[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to fetch inventory items",
        response.status
      );
    }

    return data;
  },

  async createInventoryItem(itemData: {
    name: string;
    total_added: number;
    current_quantity: number;
  }): Promise<InventoryItem> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to create inventory item",
        response.status
      );
    }

    return data;
  },

  async updateInventoryItem(
    id: number,
    itemData: Partial<{
      name: string;
      total_added: number;
      current_quantity: number;
    }>
  ): Promise<InventoryItem> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to update inventory item",
        response.status
      );
    }

    return data;
  },

  async deleteInventoryItem(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.error || "Failed to delete inventory item",
        response.status
      );
    }
  },

  async chatWithAI(
    message: string,
    csvData?: string,
    businessProfile?: BusinessProfile
  ): Promise<ChatResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const requestBody: any = {
      message,
    };

    if (csvData) {
      requestBody.csv_data = csvData;
    }

    if (businessProfile) {
      requestBody.business_profile = businessProfile;
    }

    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to get AI response",
        response.status
      );
    }

    return data;
  },

  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    password2: string;
    user_type: string;
    username: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || data.detail || "Registration failed",
        response.status
      );
    }

    return data;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || data.detail || "Login failed",
        response.status
      );
    }

    return data;
  },

  async deleteAccount() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/delete-account/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.error || "Failed to delete account",
        response.status
      );
    }
  },

  async getReports() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/reports/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to fetch reports",
        response.status
      );
    }

    return data;
  },

  async downloadReport(reportId: number): Promise<Blob> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.error || "Failed to download report",
        response.status
      );
    }

    return response.blob();
  },
};
