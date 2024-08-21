package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.UserRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void approveManager(Long userId) {
        userRepository.updateUserRole(userId, UserRole.ROLE_MANAGER);
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findAllByUserRole(role);
    }

    @Override
    public void updateUserStatusById(Long userId, UserStatus status) {
        userRepository.updateUserStatus(userId, status);
    }

    @Override
    public User update(CreateUserDto createUserDto) {
        User user = dtoMapper.createUserDtoToUser(createUserDto);
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public UserUpdateDto update(UserUpdateDto userUpdate) {
        User user = userRepository.findById(userUpdate.getId()).orElseThrow(() -> new ResourceNotFoundException("User does not found"));
        user = user.toBuilder()
                .firstName(userUpdate.getFirstname())
                .lastName(userUpdate.getLastname())
                .region(userUpdate.getRegion())
                .profileImageUrl(userUpdate.getProfileImageUrl())
                .build();
        userRepository.save(user);
        return userUpdate;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));
    }

    @Override
    public UserUpdateDto getUserUpdateDtoById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
        return UserUpdateDto.builder()
                .id(id)
                .lastname(user.getLastName())
                .firstname(user.getFirstName())
                .region(user.getRegion())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with username " + username + " not found"));
    }
}
