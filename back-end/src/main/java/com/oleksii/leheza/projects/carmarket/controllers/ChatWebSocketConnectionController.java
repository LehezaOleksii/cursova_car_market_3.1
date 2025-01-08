package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessageDto;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatMessageService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatRoomService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
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
    private final UserService userService;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatSendMessage chatSendMessage) {
        if (chatRoomService.getChat(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId()).isEmpty()) {
            chatRoomService.createChatRoom(chatSendMessage.getSenderId(), chatSendMessage.getRecipientId());
        }
        ChatMessageDto chatMessageDto = chatMessageService.createMessage(chatSendMessage);
//        String senderName = userService.getFullUserNameById(chatSendMessage.getSenderId());
//        messagingTemplate.convertAndSendToUser(
//                chatSendMessage.getRecipientId(), "/messages",
//                new ChatNotification(
//                        chatSendMessage.getRecipientId(),
//                        chatSendMessage.getSenderId(),
//                        senderName));
        messagingTemplate.convertAndSendToUser(
                chatSendMessage.getRecipientId(), "/messages", chatMessageDto);
    }
}
