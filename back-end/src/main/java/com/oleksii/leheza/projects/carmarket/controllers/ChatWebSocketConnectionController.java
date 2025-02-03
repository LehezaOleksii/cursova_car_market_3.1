package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessageStatus;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatMessageService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketConnectionController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatSendMessage chatSendMessage) {
        if (chatRoomService.getChat(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId()).isEmpty()) {
            chatRoomService.createChatRoom(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId());
        }
        ChatMessage chatMessage = chatMessageService.createMessage(chatSendMessage);
        messagingTemplate.convertAndSendToUser(
                chatSendMessage.getRecipientId(), "/messages", chatMessage);
    }

    @MessageMapping("/chat/message/status")
    public void processMessageStatus(@Payload ChatSendMessageStatus chatSendMessageStatus) {
        ChatMessage chatMessage = chatMessageService.changeMessageSatus(chatSendMessageStatus);
        messagingTemplate.convertAndSendToUser(
                chatSendMessageStatus.getSenderId(), "/messages", chatMessage);
    }
}
