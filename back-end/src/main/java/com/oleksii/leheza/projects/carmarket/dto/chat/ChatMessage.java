package com.oleksii.leheza.projects.carmarket.dto.chat;

import com.oleksii.leheza.projects.carmarket.enums.ChatMessageType;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private ChatMessageType type;
    private ChatAbstractMessage message;
}
