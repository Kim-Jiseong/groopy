import apiClient from "@/utils/apiClient";

export const getChatFullInfo = async ({ employed_crew_id, chat_id }: { employed_crew_id:number, chat_id:  number | null | "new" }) => {
    const response = await apiClient.get("employed_crews/" + employed_crew_id + "/chats/" + chat_id + "/info");
    return response.data;
  };

export const kickOffChat = async ({ employed_crew_id, chat_id }: { employed_crew_id:number, chat_id:  number | null | "new" }) => {
    if(typeof chat_id === "number"){
      const response = await apiClient.post("employed_crews/" + employed_crew_id + "/chats/" + chat_id + "/kick-off");
      return response.data;
    }
    return {message:"chat_id is not a number"};
}


type ChatData = {
  content: string;
  role: string;
}

export const createNewChatWithPreQuestion = async ({ employed_crew_id, data }: { employed_crew_id:number, data: ChatData[]}) => {
    const response = await apiClient.post("employed_crews/" + employed_crew_id + "/chats/start", data);
    return response.data;
  }