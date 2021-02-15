package com.springreact.template.db;

import com.sun.istack.NotNull;

import javax.persistence.*;
import java.util.List;

/* Local Database */
@Entity
@Table(name = "user")
public class User {

    /* Model of the MySQL Table 'users'*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    private Long id;
    private String name;
    private String email;

    @OneToMany(mappedBy = "user")
    private List<Task> tasks;

    public User() {
    }

    // no id, auto generate uuid in database
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public Long getUserID() {
        return id;
    }

    public void setUserID(Long userId) {
        this.id = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
