import { SignUp } from "@/schema/sign-up";
import { Todo } from "@/schema/todo";
import { User } from "@/schema/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.text().catch(() => response.statusText);
    console.error("API Error:", response.status, errorData);
    throw new Error(errorData || `Error: ${response.status}`);
  }

  // If the response is empty or status is 204 No Content, return null
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null as T;
  }

  // Only try to parse JSON if we have content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    // Check if there's actual content to parse
    return text ? JSON.parse(text) : (null as T);
  }

  return null as T;
}

// User API functions
export const userApi = {
  getUserByUsername: async (username: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
    });
    return handleResponse<User>(response);
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
    });
    return handleResponse<User>(response);
  },

  createUser: async (user: User): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
      body: JSON.stringify(user),
    });
    return handleResponse<User>(response);
  },

  updateUser: async (user: User): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
      body: JSON.stringify(user),
    });
    return handleResponse<User>(response);
  },

  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
    });
    return handleResponse<void>(response);
  },

  signIn: async (credentials: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
      body: JSON.stringify(credentials),
    });
    return handleResponse<User>(response);
  },

  signUp: async (user: SignUp): Promise<SignUp> => {
    console.log("Sending signup request to:", `${API_BASE_URL}/auth/register`);
    console.log("Request payload:", JSON.stringify(user));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      console.log("Response status:", response.status);
      return handleResponse<User>(response);
    } catch (error) {
      console.error("Network error during signup:", error);
      throw error;
    }
  },
};

// Todo API functions
export const todoApi = {
  getTodosByUserId: async (userId: number): Promise<Todo[]> => {
    const response = await fetch(`${API_BASE_URL}/todos/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
    });
    return handleResponse<Todo[]>(response);
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/todo/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
    });
    return handleResponse<Todo>(response);
  },

  createTodo: async (todo: Partial<Todo>): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
      body: JSON.stringify(todo),
    });
    return handleResponse<Todo>(response);
  },

  updateTodo: async (todo: Partial<Todo>): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for auth
      body: JSON.stringify(todo),
    });
    return handleResponse<Todo>(response);
  },

  deleteTodo: async (id: number): Promise<void> => {
    console.log(`Deleting todo with id: ${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for auth
      });

      // We don't expect content from a DELETE operation
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(
          errorText || `Failed to delete todo. Status: ${response.status}`
        );
      }

      console.log(`Successfully deleted todo ${id}`);
      return;
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  },
};
