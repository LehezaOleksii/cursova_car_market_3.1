package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateClientDto;
import com.oleksii.leheza.projects.carmarket.dto.security.SignInDto;
import com.oleksii.leheza.projects.carmarket.entities.Admin;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.entities.Manager;
import com.oleksii.leheza.projects.carmarket.repositories.AdminRepository;
import com.oleksii.leheza.projects.carmarket.repositories.ClientRepository;
import com.oleksii.leheza.projects.carmarket.repositories.ManagerRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ClientService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class LoginController {

    private final ManagerService managerService;
    private final ClientService clientService;
    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;
    private final ManagerRepository managerRepository;

    // signup if email already exist than no

    @PostMapping("clients/signup")
    public ResponseEntity<Client> clientSignUp(@RequestBody CreateClientDto createClientDto) {
        return new ResponseEntity<>(clientService.save(createClientDto), HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInDto signInDto) {
        String email = signInDto.getEmail();
        if (clientRepository.findByEmail(email).isPresent()) {
            Client client = clientRepository.findByEmail(email).get();
            if (client.getPassword().equals(signInDto.getPassword())) {
                return new ResponseEntity<>(client, HttpStatus.OK);
            }
        } else if (managerRepository.findByEmail(email).isPresent()) {
            Manager manager = managerRepository.findByEmail(email).get();
            if (manager.getPassword().equals(signInDto.getPassword())) {
                return new ResponseEntity<>(manager, HttpStatus.OK);
            }
        } else if (adminRepository.findByEmail(email).isPresent()) {
            Admin admin = adminRepository.findByEmail(email).get();
            if (admin.getPassword().equals(signInDto.getPassword())) {
                return new ResponseEntity<>(admin, HttpStatus.OK);
            }
        }
        throw new ResourceNotFoundException("User with email not found");
    }
}
