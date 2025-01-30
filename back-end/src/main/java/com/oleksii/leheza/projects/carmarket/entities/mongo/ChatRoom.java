package com.oleksii.leheza.projects.carmarket.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Data
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
}