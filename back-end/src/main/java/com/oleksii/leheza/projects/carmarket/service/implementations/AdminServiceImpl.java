//package com.oleksii.leheza.projects.carmarket.service.implementations;
//
//import com.oleksii.leheza.projects.carmarket.entities.Admin;
//import com.oleksii.leheza.projects.carmarket.entities.Client;
//import com.oleksii.leheza.projects.carmarket.entities.Manager;
//import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
//import com.oleksii.leheza.projects.carmarket.enums.UserRole;
//import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
//import com.oleksii.leheza.projects.carmarket.repositories.AdminRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.ClientRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.ManagerRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.UserRepository;
//import com.oleksii.leheza.projects.carmarket.service.interfaces.AdminService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class AdminServiceImpl implements AdminService {
//
//    private final AdminRepository adminRepository;
//    private final ManagerRepository managerRepository;
//    private final UserRepository userRepository;
//    private final ClientRepository clientRepository;
//
//    @Override
//    public Admin findById(Long adminId) {
//        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);
//        return optionalAdmin.orElseGet(Admin::new);
//    }
//
//    @Override
//    public Admin save(Admin admin) {
//        String email = admin.getEmail();
//        Optional<Admin> clientOptional = adminRepository.findByEmail(email);
//        if (clientOptional.isEmpty()) {
//            admin.setUserRole(UserRole.ADMIN);
//            return adminRepository.save(admin);
//        } else {
//            throw new ResourceAlreadyExistsException("Admin with email " + email + "already exists.");
//        }
//    }
//
//    @Override
//    public Manager saveManager(Manager manager) {
//        return managerRepository.save(manager);
//    }
//
//    @Override
//    public Manager findManagerById(Long managerId) {
//        return managerRepository.findById(managerId).get();
//    }
//
//    @Override
//    public void approveManager(Long clientId) {
//        Client client = clientRepository.findById(clientId).get();
//        String email = client.getEmail();
//        List<Vehicle> vehicles = client.getVehicles();
//        Manager manager =
//                Manager.builder()
//                        .userRole(UserRole.MANAGER)
//                        .firstName(client.getFirstName())
//                        .lastName(client.getLastName())
//                        .password(client.getPassword())
//                        .profileImageUrl(client.getProfileImageUrl())
//                        .region(client.getRegion())
//                        .vehicles(vehicles)
//                        .build();
//        clientRepository.deleteById(clientId);
//        manager.setEmail(email);
//        managerRepository.save(manager);
//    }
//
//    @Override
//    public List<Client> getUsersToApprove() {
//        return clientRepository.findAll().stream()
//                .filter(client -> client.getUserRole().equals(UserRole.CLIENT))
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<Manager> getManagers() {
//        return managerRepository.findAll();
//    }
//
//    @Override
//    public void blockManager(Long managerId) {
//        managerRepository.deleteById(managerId);
//    }
//}
