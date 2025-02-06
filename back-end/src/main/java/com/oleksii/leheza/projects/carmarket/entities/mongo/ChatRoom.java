package com.oleksii.leheza.projects.carmarket.entities.mongo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private String id;
    private String firstUserId;
    private String secondUserId;
    private List<ChatMessageMongo> firstUserMessages = new ArrayList<>();
    private List<ChatMessageMongo> secondUserMessages = new ArrayList<>();

    public void sortMessagesById(String firstUserId) {
        if (!firstUserId.equals(this.firstUserId)) {
            String tempFirstUserId = firstUserId;
            this.firstUserId = secondUserId;
            this.secondUserId = tempFirstUserId;

            List<ChatMessageMongo> tempFirstUserMessages = firstUserMessages;
            this.firstUserMessages = secondUserMessages;
            this.secondUserMessages = tempFirstUserMessages;
        }
    }

    public Optional<ChatMessageMongo> getLastChatMessage() {
        return Stream.concat(firstUserMessages.stream(), secondUserMessages.stream())
                .max(Comparator.comparing(ChatMessageMongo::getTimestamp));
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatMessageMongo {

        @jakarta.persistence.Id
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
}