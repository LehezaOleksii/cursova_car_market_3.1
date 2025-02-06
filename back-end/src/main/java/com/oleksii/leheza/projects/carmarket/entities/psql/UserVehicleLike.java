package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@Entity
@AllArgsConstructor
@Table(name = "user_vehicle_likes")
public class UserVehicleLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private boolean isLiked;
}
