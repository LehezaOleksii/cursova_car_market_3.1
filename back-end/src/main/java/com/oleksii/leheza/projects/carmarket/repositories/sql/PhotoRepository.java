package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
}
