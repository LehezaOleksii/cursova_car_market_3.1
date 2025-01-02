package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.psql.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<OtpToken, Long> {

    Boolean existsByPassword(int password);

    void deleteByPassword(int password);

    Boolean existsByUserEmail(String email);

    void deleteByUserEmail(String email);
}
