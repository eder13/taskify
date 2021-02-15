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

public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

    // query for checking if the task belongs to the user
    @RestResource(exported = false)
    @Query(value = "SELECT u.user.id FROM Task u WHERE u.user = :user AND u.id = :id")
    Long getTaskByUserAndId (
            @Param("user") User user,
            @Param("id") Long id
    );

    // query for getting associated user
    @RestResource(exported = false)
    @Query(value = "SELECT u.user.id FROM Task u WHERE u.id = :id")
    Long getAssociatedUserId(
            @Param("id") Long id
    );

    // generally posting is allowed to /api/tasks to add a value
    // since PUT also uses the save method, we have to validate explicitely PUT inside
    // spring security and not here, otherwise it would treat PUT/POST the same here

    // saveAll should be disabled generally
    @Override
    @RestResource(exported = false)
    <S extends Task> Iterable<S> saveAll(Iterable<S> var1);

    // only allow getting own task (=protecting own endpoints in one to many fashion)
    @PreAuthorize("@accessHandler.isOwner(authentication, #id) or @accessHandler.isAdmin(authentication)")
    @Override
    Optional<Task> findById(Long id);

    // existsById is not needed generally
    @Override
    @RestResource(exported = false)
    boolean existsById(Long var1);

    // GET-ting all available users only for admins (1) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<Task> findAll();

    // GET-ting all available users only for admins (2) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<Task> findAll(Sort sort);

    // GET-ting all available users only for admins (3) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Page<Task> findAll(Pageable pageable);

    // GET-ting all available users only for admins (4) (GET)
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    Iterable<Task> findAllById(Iterable<Long> var1);

    // this method is only for admins
    @PreAuthorize("@accessHandler.isAdmin(authentication)")
    @Override
    long count();

    // only allow a user to delete his own data (1)
    @PreAuthorize("@accessHandler.isOwner(authentication, #id) or @accessHandler.isAdmin(authentication)")
    @Override
    void deleteById(Long id);

    // only allow a user to delete his own data (1)
    @PreAuthorize("@accessHandler.isOwner(authentication, #task.id) or @accessHandler.isAdmin(authentication)")
    @Override
    void delete(Task task);

    // don't allow anyone to wipe more selected user data
    @Override
    @RestResource(exported = false)
    void deleteAll(Iterable<? extends Task> var1);

    // don't allow anyone to wipe whole user data
    @Override
    @RestResource(exported = false)
    void deleteAll();

}
