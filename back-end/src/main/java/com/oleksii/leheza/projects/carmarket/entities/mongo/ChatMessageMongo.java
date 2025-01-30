package com.oleksii.leheza.projects.carmarket.entities.mongo;

import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessageMongo {

    @Id
    private String id;
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status;

    public ChatMessageMongo(String content) {
        this.content = content;
        this.timestamp = LocalDateTime.now();
        this.status = MessageStatus.CREATED;
    }

    public ChatMessageMongo(String content, MessageStatus status) {
        this.content = content;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }
}