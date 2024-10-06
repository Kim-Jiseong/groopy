import apiClient from "@/utils/apiClient";

export const getCrewInfo = async ({ crewId }: { crewId: number }) => {
    const response = await apiClient.get("crews/" + crewId + "/info");
    return response.data;
  };

export const verifyCrew = async ({ crewId }: { crewId: number }) => {
    const response = await apiClient.get("crews/" + crewId + "/verify");
    return response.data;
}

export const publishCrew = async ({ crewId }: { crewId: number }) => {
    const response = await apiClient.post("crews/" + crewId + "/publish");
    return response.data;
}