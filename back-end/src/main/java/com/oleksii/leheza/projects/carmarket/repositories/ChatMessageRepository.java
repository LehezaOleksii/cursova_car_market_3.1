package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    long countBySenderIdAndRecipientIdAndStatus(String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);
}