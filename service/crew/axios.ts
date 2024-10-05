import apiClient from "@/utils/apiClient";

export const getCrewInfo = async ({ crewId }: { crewId: string | number }) => {
    const response = await apiClient.get("crews/" + crewId + "/info");
    return response.data;
  };