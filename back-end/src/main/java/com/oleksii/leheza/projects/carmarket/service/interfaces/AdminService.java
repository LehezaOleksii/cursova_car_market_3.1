package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.entities.Admin;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.entities.Manager;

import java.util.List;

public interface AdminService {

    void approveManager(Long managerId);

    List<Client> getUsersToApprove();

    List<Manager> getManagers();

    void blockManager(Long managerId);

    Admin findById(Long clientId);

    Admin save(Admin admin);

    Manager saveManager(Manager manager);

    Manager findManagerById(Long managerId);
}
