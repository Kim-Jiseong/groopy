'use server'

import { Tables, TablesInsert } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type Message = {
    agent_id: number | null;
    chat_id: number;
    content: string | null;
    cost: number | null;
    created_at: string;
    cycle_id: number | null;
    id: number;
    input_token: number | null;
    output_token: number | null;
    role: string | null;
    task_id: number | null;
    type: string | null;
  };

export const getChatListByECID = async (employed_crew_id: number) => {
    const supabase = createClient();
        const { data: chat, error: chatError } = await supabase
                .from("chat")
                .select("*")
                .eq("employed_crew_id", employed_crew_id)
                .eq("is_deleted", false)
                .order("updated_at", { ascending: false });
        return chat

    }


export const getChatFullData = async (chatId: number) => {
    // Supabase 클라이언트 초기화
    const supabase = createClient();
    
    // chat 데이터 가져오기
    const { data: chatData, error: chatError } = await supabase
        .from('chat')
        .select('*')
        .eq('id', chatId)
        .single();
    
    if (chatError) {
        console.error('Error fetching chat data:', chatError);
        throw chatError;
    }
    
    // 해당 chat에 연결된 cycle들 가져오기 
    const { data: cycleData, error: cycleError } = await supabase
        .from('cycle')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true }); 
    
    if (cycleError) {
        console.error('Error fetching cycle data:', cycleError);
        throw cycleError;
    }
    
    // 각 cycle에 연결된 message들 가져오기
    const cycleIds = cycleData.map((cycle) => cycle.id);
    let messagesData:Message[] = [];
    
    if (cycleIds.length > 0) {
        const { data: messages, error: messageError } = await supabase
        .from('message')
        .select('*')
        .in('cycle_id', cycleIds)
        .order('created_at', { ascending: true }); 
    
        if (messageError) {
        console.error('Error fetching messages:', messageError);
        throw messageError;
        }
    
        messagesData = messages;
    }
    
    // 최종 데이터를 구조화해서 반환 (cycle과 message 모두 최신순으로 정렬)
    const finalData = {
        ...chatData,
        cycles: cycleData.map((cycle) => ({
        ...cycle,
        messages: messagesData.filter((message) => message.cycle_id === cycle.id),
        })),
    };
      
        return finalData;
};


export const createUserMessage = async ({ chat_id, message }: { chat_id:  number | null | "new", message: string }) => {
    const supabase = createClient();
    if (typeof chat_id  === "number"){

        const { data: insertedCycleData, error: insertCycleError } = await supabase
        .from('cycle')
        .insert({
            chat_id: chat_id,
            status: "STARTED",
        }).select().single();
        if(insertCycleError){
            throw new Error('cycle 생성 중 오류가 발생했습니다.');
        }
        const { data: insertedMessageData, error: insertMessageError } = await supabase
        .from('message')
        .insert({
            chat_id: chat_id,
            cycle_id: insertedCycleData.id,
            content: message,
            role: "user",
        })
        .select().single(); 
        
        if (insertMessageError) {
            throw new Error('message 생성 중 오류가 발생했습니다.');
        }
        return {cycle: insertedCycleData, message: insertedMessageData};
    }
    return {message:"chat_id is not a number"};
}