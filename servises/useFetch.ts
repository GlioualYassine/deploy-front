// "use client";

import axiosInstance from "@/lib/axiosInstance";

const publicUrl = process.env.NEXT_PUBLIC_URL;

if (!publicUrl) {
  throw new Error(
    "NEXT_PUBLIC_URL is not defined in the environment variables."
  );
}

type Filter = {
  globalSearch?: string;
  size?: number;
  currentPage?: number;
  clientId?: number;
  endDate?: string;
  startDate?: string;
};

type ApiResponse<T> = {
  data: T;
};

export function useFetch<T>(url: string) {
  function buildQueryParams(filter: Filter): string {
    const params = new URLSearchParams();

    if (filter.globalSearch) params.append("globalSearch", filter.globalSearch ?? "");
    if (filter.size) params.append("size", String(filter.size ?? 10));
    if (filter.currentPage ?? 1)
      params.append("currentPage", String(filter.currentPage));
    if(filter.clientId) params.append("clientId", String(filter.clientId));
    if(filter.startDate) params.append("startDate", filter.startDate);
    if(filter.endDate) params.append("endDate", filter.endDate);



    return params.toString();
  }

  const fetchAll = async (filter:any) => {
    const queryParams = buildQueryParams(filter);
    const fetchUrl = `/${url}?${queryParams}`;

    try {
      const response = await axiosInstance.get(fetchUrl);
      const data = await response.data.content;
      const pagination = {
        totalElements: response.data.totalElements,
        numberOfElements: response.data.numberOfElements,
        offsetElements: response.data.pageable.offset,
        size: response.data.size,
        currentPage: response.data.number + 1,
        totalPage: response.data.totalPages,
      };
      const res = {
        data,
        pagination,
      };
      console.log("res", res);
      

      return res;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };


  const findById = async (id: number) => {
    try {
      console.log("id", id);
      
      const response = await axiosInstance.get(`/${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  return { fetchAll , findById };
}
