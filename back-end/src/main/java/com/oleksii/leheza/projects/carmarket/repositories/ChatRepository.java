package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.chat.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUserOneOrUserTwo(User userOne, User userTwo);
}

