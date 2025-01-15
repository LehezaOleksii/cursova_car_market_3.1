package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatHistory;
import com.oleksii.leheza.projects.carmarket.dto.chat.UserChatName;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {

    void createChatRoom(String senderId, String recipientId);

    Optional<ChatRoom> getChat(String senderId, String recipientId);

    ChatHistory retrieveChatHistory(String firstUserId, String secondUserId);

    List<UserChatName> getUserChats(String userId);

    List<UserChatName> getUserChatsByName(String id, String name);
}
