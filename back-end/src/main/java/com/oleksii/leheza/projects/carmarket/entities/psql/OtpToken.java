package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@Table(name = "otp_tokens")
public class OtpToken {

    private static int currentPassword = 5487;
    @Id
    @SequenceGenerator(name = "otp_sequence", sequenceName = "otp_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "otp_sequence")
    private Long id;
    private int password;
    @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public OtpToken(User user) {
        this.user = user;
        currentPassword = (currentPassword >= 9999) ? 1000 : currentPassword + 1;
        password = currentPassword;
    }
}
