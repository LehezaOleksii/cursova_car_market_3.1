package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessageDto;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessage;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import org.springframework.stereotype.Service;

@Service
public interface ChatMessageService {

    ChatMessageDto createMessage(ChatSendMessage chatMessage);

    ChatMessage findById(String id);

    void updateStatuses(String senderId, String recipientId, MessageStatus status);
}
