package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends
        JpaRepository<User, Long>,
        JpaSpecificationExecutor<User>,
        PagingAndSortingRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.userRole = :role WHERE u.id = :userId")
    void updateUserRole(Long userId, UserRole role);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    void updateUserStatus(Long userId, UserStatus status);

    List<User> findAllByUserRole(UserRole role);

    Optional<User> findByEmailIgnoreCase(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.email = :email")
    void updateUserPasswordByEmail(@Param("email") String email, @Param("newPassword") String newPassword);

    @Query("SELECT u.id FROM User u WHERE u.email = :username")
    Optional<Long> getUserIdByEmail(String username);

    @Query("SELECT u.userRole FROM User u WHERE u.id = :id")
    UserRole findRoleById(Long id);

    @Query("SELECT u.userRole FROM User u WHERE u.email = :email")
    String findRoleByEmail(String email);
}
