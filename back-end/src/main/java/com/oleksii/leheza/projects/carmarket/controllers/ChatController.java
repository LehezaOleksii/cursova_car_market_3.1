package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.entities.chat.Chat;
import com.oleksii.leheza.projects.carmarket.entities.chat.ChatMessage;
import com.oleksii.leheza.projects.carmarket.exceptions.ChatException;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        Chat chat = chatService.getUserChats(chatMessage.getSender()).stream()
                .filter(c -> c.getUserOne().equals(chatMessage.getSender()) || c.getUserTwo().equals(chatMessage.getSender()))
                .findFirst()
                .orElseThrow(() -> new ChatException("Chat session does not exist"));
        return chatService.addMessage(chat, chatMessage.getSender(), chatMessage.getContent());
    }
}