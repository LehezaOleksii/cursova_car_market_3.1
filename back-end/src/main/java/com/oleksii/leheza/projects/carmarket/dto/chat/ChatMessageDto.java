package com.oleksii.leheza.projects.carmarket.dto.chat;

import com.oleksii.leheza.projects.carmarket.enums.MessageStatus;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto extends ChatAbstractMessage{

    private String id;
    private String recipientId;
    private String content;
    private String timestamp;
    private MessageStatus status;
}
