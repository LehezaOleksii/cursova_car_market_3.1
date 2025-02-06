package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private byte[] photo;

    public Photo(byte[] photo) {
        this.photo = photo;
    }
}
