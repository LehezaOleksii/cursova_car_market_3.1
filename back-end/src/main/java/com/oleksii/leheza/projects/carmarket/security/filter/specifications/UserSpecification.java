package com.oleksii.leheza.projects.carmarket.security.filter.specifications;

import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.repositories.sql.UserRepository;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehilcleSearchCriteria;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserSpecification {

    private static final String DELIMITER = " ";

    private final UserRepository userRepository;

    public Page<User> getUsersWithCriterias(VehilcleSearchCriteria criterias, int page, int size, Sort sort) {
        log.info("Start creating user specifications");
        List<Specification<User>> specifications = new ArrayList<>();
        if (criterias.getStatus() != null && !criterias.getStatus().startsWith("ALL") && !criterias.getStatus().isEmpty()) {
            specifications.add(statusLike(criterias));
        }
        if (criterias.getEmail() != null && !criterias.getEmail().isEmpty()) {
            specifications.add(emailLike(criterias));
        }
        if (criterias.getFullName() != null && getFirstName(criterias.getFullName()) != null && !getFirstName(criterias.getFullName()).isEmpty()) {
            specifications.add(firstNameLike(getFirstName(criterias.getFullName())).or(lastNameLike(getLastName(criterias.getFullName()))));
        }
        if (criterias.getRole() != null && !criterias.getRole().startsWith("ALL") && !criterias.getRole().isEmpty()) {
            specifications.add(roleLike(criterias));
        }
        if (criterias.getRole() != null && !criterias.getRole().startsWith("ALL") && !criterias.getRole().isEmpty()) {
            specifications.add(roleLike(criterias));
        }
        Specification<User> specification = Specification.where(Specification.allOf(specifications));
        Pageable pageable = PageRequest.of(page, size, sort);
        log.info("user specifications was created");
        return userRepository.findAll(specification, pageable);
    }

    private String getFirstName(String fullName) {
        return fullName.split(DELIMITER)[0];
    }

    private String getLastName(String fullName) {
        String[] nameParts = fullName.split(DELIMITER);
        return nameParts[nameParts.length - 1];
    }

    public Specification<User> roleLike(VehilcleSearchCriteria criteria) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("userRole"), UserRole.valueOf(criteria.getRole()));
    }

    public Specification<User> firstNameLike(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("firstName"), "%" + name + "%");
    }

    public Specification<User> lastNameLike(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("lastName"), "%" + name + "%");
    }

    public Specification<User> emailLike(VehilcleSearchCriteria criteria) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("email"), "%" + criteria.getEmail() + "%");
    }

    public Specification<User> statusLike(VehilcleSearchCriteria criteria) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), UserStatus.valueOf(criteria.getStatus()));
    }
}
