package com.springreact.template.db;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    // query for getting a user by providing the email (saved in spring on authentication)
    // this is only used for custom /userid endpoint and not for repository REST
    @RestResource(exported = false)
    @Query(value = "SELECT u FROM User u WHERE u.email = :email")
    User findUserByEmail(
            @Param("email") String email
    );

    // don't allow any client to save a user via REST
    @Override
    @RestResource(exported = false)
    <S extends User> S save(S var1);

    // saveAll should be disabled generally
    @Override
    @RestResource(exported = false)
    <S extends User> Iterable<S> saveAll(Iterable<S> var1);

    // allow user only access to own endpoints like /api/users/{MyId}
    @PreAuthorize("@accessHandler.isAllowed(authentication, #id) or @accessHandler.isAdmin(authentication)")
    @Override
    Optional<User> findById(Long id);

    // existsById is not needed generally
    @Override
    @RestResource(exported = false)
    boolean existsById(Long var1);

    // GET-ting all available users only for admins (1) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<User> findAll();

    // GET-ting all available users only for admins (2) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<User> findAll(Sort sort);

    // GET-ting all available users only for admins (3) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Page<User> findAll(Pageable pageable);

    // GET-ting all available users only for admins (4) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<User> findAllById(Iterable<Long> var1);

    // this method is only for admins
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    long count();

    // since we are using OAuth we aren't allowing anyone to add/delete his user
    @Override
    @RestResource(exported = false)
    void deleteById(Long var1);

    // i would rather use deleteById if I need such a functionality
    @Override
    @RestResource(exported = false)
    void delete(User var1);

    // don't allow any one to wipe selected user data
    @Override
    @RestResource(exported = false)
    void deleteAll(Iterable<? extends User> var1);

    // don't allow any one to wipe whole user data
    @Override
    @RestResource(exported = false)
    void deleteAll();
}