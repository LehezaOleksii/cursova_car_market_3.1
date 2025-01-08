package com.oleksii.leheza.projects.carmarket.dto.chat;

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
    private String email;
    private byte[] profilePicture;
}
