package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.chat.Chat;
import com.oleksii.leheza.projects.carmarket.entities.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChat(Chat chat);
}