package com.oleksii.leheza.projects.carmarket.entities.mongo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessageMongo {

    @Id
    private String id;
    private String content;
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
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