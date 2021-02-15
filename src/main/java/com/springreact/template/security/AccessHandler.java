package com.springreact.template.security;

import com.springreact.template.db.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class AccessHandler {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public AccessHandler(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public boolean isAllowed(Authentication a, Long id) {

        if (a instanceof OAuth2AuthenticationToken) {
            // get email of currently logged in user
            OAuth2User oauth2user = ((OAuth2AuthenticationToken) a).getPrincipal();
            String email = oauth2user.getAttribute("email");

            // get id of logged in user and check if that id equals to the endpoint id which is given as Parameter
            return userRepository.findUserByEmail(email).getUserID().equals(id);
        } else {
            // no OAuth2 User -> no login
            return false;
        }
    }

    public boolean isAdmin(Authentication a) {
        return a.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean isOwner(Authentication a, Long id) {

        if (a instanceof OAuth2AuthenticationToken) {
            // get email of currently logged in user
            OAuth2User oauth2user = ((OAuth2AuthenticationToken) a).getPrincipal();
            String email = oauth2user.getAttribute("email");

            // check if user_id is still NULL, which means that a user posted it and is now trying to connect it
            // TODO: maybe write a script that every x hours those entries will be deleted if still NULL?
            Long connectedBy = taskRepository.getAssociatedUserId(id);

            if(connectedBy == null){
                // allow to establish a new association
                return true;
            } else {
                // user might want to alter data: Check if he's allowed to do that
                Long foundId = taskRepository.getTaskByUserAndId(userRepository.findUserByEmail(email), id);
                return foundId != null;
            }

        } else {
            return false;
        }
    }

    //    public boolean isTestUser(Authentication a) {
    //        // Check e.g. if has "ROLE_TEST" applied
    //    }
}
