package com.oleksii.leheza.projects.carmarket.dto.chat;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatSendMessageStatus extends ChatAbstractMessage{

    private String senderId;
    private String recipientId;
    private String messageId;
    private String status;
}
