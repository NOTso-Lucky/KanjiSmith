const API_BASE_URL="http://127.0.0.1:8000";

export async function api(endpoint,options={}){
    const response=await fetch(`${API_BASE_URL}${endpoint}`,{
        headers:{
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data=await response.json()

    if(!response.ok){
        throw new Error(data.detail || "Something went wrong");
    }
    return data
}