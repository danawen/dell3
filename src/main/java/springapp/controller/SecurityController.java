package springapp.controller;

import java.security.Principal;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Simple Controller that handles the home page and login/logout pages
 */
@Controller
public class SecurityController {

    /**
     * The login page does not change based on the model and is a "static" page
     *
     * @return home page view template
     */
    @GetMapping("/")
    public String getWelcome(Principal user) {
        if (user != null)
            return "home";
        return "login";
    }

    /**
     * The login page does not change based on the model and is a "static" page
     *
     * @return home page view template
     */
    @GetMapping("/home")
    public String getClient() {
        return "home";
    }

    /**
     * The login page does not change based on the model and is a "static" page
     *
     * @return login page view template
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}