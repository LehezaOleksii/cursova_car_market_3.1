package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.dto.view.UserManagerDashboardDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.UserSearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    void approveManager(Long userId);

    List<User> getUsersByRole(UserRole role);

    void updateUserStatusByOtherUserById(Long userId, UserStatus status);

    UserUpdateDto update(UserUpdateDto user);

    User findByEmail(String email);

    UserUpdateDto getUserUpdateDtoById(Long id);

    boolean existByEmail(String email);

    void updateUserPasswordByEmail(String email, String newPassword);

    void confirmEmail(String token);

    Long getUserIdByEmail(String username);

    Page<UserManagerDashboardDto> getUsersWithFilter(int page, int size, UserSearchCriteria criteria);

    String getUserRoleByEmail(String email);

    String getUserIdByVehicleId(Long vehicleId);

    boolean isUserHasHigherRole(Long otherUserId);

    Page<UserManagerDashboardDto> findAllUsersManagerDashboardDto(int page, int size);
}
