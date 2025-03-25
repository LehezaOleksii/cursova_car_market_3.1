package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.EmailConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailConfirmationRepository extends JpaRepository<EmailConfirmation, Long> {

    Optional<EmailConfirmation> findByToken(String token);

    @Query("SELECT ec FROM EmailConfirmation ec WHERE ec.user.id = :userId")
    Optional<EmailConfirmation> findByUserId(Long userId);
}
