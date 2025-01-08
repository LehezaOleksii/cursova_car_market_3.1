package com.oleksii.leheza.projects.carmarket.dto.chat;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {

    private List<ChatMessageDto> firstMessages;
    private List<ChatMessageDto> secondMessages;
}
