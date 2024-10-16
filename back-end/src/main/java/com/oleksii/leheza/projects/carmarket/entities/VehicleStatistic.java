package com.oleksii.leheza.projects.carmarket.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicle_statistics")
public class VehicleStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int likes;
    private int views;

    public void incrementLikes() {
        likes++;
    }

    public void incrementViews() {
        views++;
    }
}
