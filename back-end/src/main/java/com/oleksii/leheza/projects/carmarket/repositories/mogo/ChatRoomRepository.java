package com.oleksii.leheza.projects.carmarket.repositories.mogo;

import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    @Query("{ '$or': [ " +
            "{ 'firstUserId': ?0, 'secondUserId': ?1 }, " +
            "{ 'firstUserId': ?1, 'secondUserId': ?0 } " +
            "] }")
    Optional<ChatRoom> findByFirstUserAndSecondUserId(String firstUserId, String secondUserId);

    @Query(value = "{ '$or': [ { 'firstUserId': ?0 }, { 'secondUserId': ?0 } ] }", fields = "{ 'id': 1 }")
    List<Long> getUserChatRoomIdsByUserId(String userId);
}