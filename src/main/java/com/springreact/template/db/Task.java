package com.springreact.template.db;

import com.sun.istack.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private boolean workHome;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;

    private boolean done;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    public Task() {}

    public Task(Long id, @NotBlank String title, @NotBlank String description, @NotBlank boolean workHome, Date date, boolean done, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.workHome = workHome;
        this.date = date;
        this.done = done;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isWorkHome() {
        return workHome;
    }

    public void setWorkHome(boolean workHome) {
        this.workHome = workHome;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
