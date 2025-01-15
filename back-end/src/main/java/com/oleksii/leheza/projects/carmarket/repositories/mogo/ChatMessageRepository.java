package com.oleksii.leheza.projects.carmarket.repositories.mogo;

import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
}