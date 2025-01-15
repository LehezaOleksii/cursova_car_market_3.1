package com.oleksii.leheza.projects.carmarket.dto.chat;

import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserChatName {

    private Long id;
    private String firstName;
    private String lastName;
    private ChatMessage lastMessage;
    private String email;
    private byte[] profilePicture;

    public UserChatName(Long id, String firstName, String lastName, String email, byte[] profilePicture) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.profilePicture = profilePicture;
    }
}