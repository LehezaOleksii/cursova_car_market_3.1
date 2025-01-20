package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehilcleSearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    //TODO DTOS
    void approveManager(Long userId);

    List<User> getUsersByRole(UserRole role);

    void updateUserStatusByOtherUserById(Long userId, UserStatus status);

    UserUpdateDto update(UserUpdateDto user);

    List<User> findAll();

    User findById(Long userId);

//    Client authorization(String email, String password);

    User findByEmail(String email);

    UserUpdateDto getUserUpdateDtoById(Long id);

    boolean existByEmail(String email);

    void updateUserPasswordByEmail(String email, String newPassword);

    void confirmEmail(String token);

    Long getUserIdByEmail(String username);

    Page<User> getUsersWithFilter(int page, int size, VehilcleSearchCriteria criteria);

    String getUserRoleByEmail(String email);

    String getFullUserNameById(String userId);

    String getUserIdByVehicleId(Long vehicleId);

    String getUserEmailById(String id);

    boolean isUserHasHigherRole(Long otherUserId);
}
