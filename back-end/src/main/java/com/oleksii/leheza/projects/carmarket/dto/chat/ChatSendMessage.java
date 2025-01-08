package com.oleksii.leheza.projects.carmarket.dto.chat;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatSendMessage {

    private String senderId;
    private String recipientId;
    private String content;
}
