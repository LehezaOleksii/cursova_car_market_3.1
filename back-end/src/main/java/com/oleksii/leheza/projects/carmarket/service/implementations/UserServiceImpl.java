package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.dto.view.UserManagerDashboardDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.EmailConfirmation;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.sql.EmailConfirmationRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.UserRepository;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.UserSearchCriteria;
import com.oleksii.leheza.projects.carmarket.security.filter.specifications.UserSpecification;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private static final String SORT_PROPERTY_FIRST_NAME = "firstName";
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailConfirmationRepository emailConfirmationRepository;
    private final UserSpecification userSpecification;
    private final DtoMapper dtoMapper;

    @Override
    public void approveManager(Long userId) {
        userRepository.updateUserRole(userId, UserRole.ROLE_MANAGER);
        log.info("Update user with id: {} to role: {}", userId, UserRole.ROLE_MANAGER);
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findAllByUserRole(role);
    }

    @Override
    public void updateUserStatusByOtherUserById(Long userId, UserStatus status) {
        userRepository.updateUserStatus(userId, status);
        log.info("Update user with id: {} to status: {}", userId, status);
    }

    @Override
    public UserUpdateDto update(UserUpdateDto userUpdate) {
        User user = userRepository.findById(userUpdate.getId()).orElseThrow(() -> new ResourceNotFoundException("User does not found"));
        user = user.toBuilder().firstName(userUpdate.getFirstname()).lastName(userUpdate.getLastname()).profileImageUrl(userUpdate.getProfileImageUrl()).build();
        userRepository.save(user);
        return userUpdate;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));
    }

    @Override
    public UserUpdateDto getUserUpdateDtoById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
        return UserUpdateDto.builder().id(id).lastname(user.getLastName()).firstname(user.getFirstName()).profileImageUrl(user.getProfileImageUrl()).build();
    }

    @Override
    public boolean existByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void updateUserPasswordByEmail(String email, String newPassword) {
        String password = passwordEncoder.encode(newPassword);
        userRepository.updateUserPasswordByEmail(email, password);
    }

    @Override
    public void confirmEmail(String token) {
        EmailConfirmation confirmation = emailConfirmationRepository.findByToken(token).orElseThrow(() -> new ResourceNotFoundException("Confirmation email does not exist"));
        updateUserStatusById(confirmation.getUser().getId(), UserStatus.ACTIVE);
        emailConfirmationRepository.delete(confirmation);
        log.info("Confirm email: " + token);
    }

    private void updateUserStatusById(Long id, UserStatus userStatus) {
        userRepository.updateUserStatus(id, userStatus);
        log.info("Update user with id: {} to status: {}", id, userStatus);
    }

    @Override
    public Long getUserIdByEmail(String username) {
        return userRepository.getUserIdByEmail(username).orElseThrow(() -> new RuntimeException("User with email " + username + " not found"));
    }

    @Override
    public Page<UserManagerDashboardDto> getUsersWithFilter(int page, int size, UserSearchCriteria criteria) {
        Sort sort = Sort.by(SORT_PROPERTY_FIRST_NAME);
        return userSpecification.getUsersWithCriterias(criteria, page, size, sort)
                .map(dtoMapper::userToUserManagerDashboardDto);
    }

    @Override
    public String getUserRoleByEmail(String email) {
        return userRepository.findRoleByEmail(email);
    }

    @Override
    public String getFullUserNameById(String userId) {
        return userRepository.findFirstNameAndLastNameById(userId);
    }

    @Override
    public String getUserIdByVehicleId(Long vehicleId) {
        return userRepository.findUserIdByVehicleId(vehicleId);
    }

    @Override
    public String getUserEmailById(String id) {
        return userRepository.findEmailById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmailIgnoreCase(username).orElseThrow(() -> new UsernameNotFoundException("User with username " + username + " not found"));
    }

    @Override
    public boolean isUserHasHigherRole(Long otherUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserRole otherUserRole = userRepository.findRoleById(otherUserId);
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            UserRole currentUserHighestRole = authorities.stream()
                    .map(authority -> UserRole.valueOf(authority.getAuthority()))
                    .max(Comparator.comparingInt(UserRole::getOrder))
                    .orElse(null);
            return currentUserHighestRole != null && currentUserHighestRole.getOrder() < otherUserRole.getOrder();
        }
        return false;
    }

    @Override
    public Page<UserManagerDashboardDto> findAllUsersManagerDashboardDto(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(dtoMapper::userToUserManagerDashboardDto);
    }
}
