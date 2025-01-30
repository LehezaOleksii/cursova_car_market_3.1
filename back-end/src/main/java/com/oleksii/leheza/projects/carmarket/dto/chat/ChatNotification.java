package com.oleksii.leheza.projects.carmarket.dto.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification extends ChatAbstractMessage{

    private String id;
    private String senderId;
    private String senderName;
    private String content;
}