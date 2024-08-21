package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.chat.Chat;
import com.oleksii.leheza.projects.carmarket.entities.chat.ChatMessage;

import java.util.List;

public interface ChatService {


    Chat createChat(User userOne, User userTwo);

    List<Chat> getUserChats(User user);

    ChatMessage addMessage(Chat chat, User sender, String content);

    List<ChatMessage> getChatMessages(Chat chat);
}
