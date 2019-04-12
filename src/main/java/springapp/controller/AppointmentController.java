package springapp.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import springapp.command.AppointmentCommand;
import springapp.domain.Client;
import springapp.domain.Appointment;
import springapp.service.ClientService;
import springapp.service.AppointmentService;

@Controller
@RequestMapping("/appointments")
public class AppointmentController {

	private Logger logger = LoggerFactory.getLogger(AppointmentController.class);

	@Autowired
	AppointmentService appointmentService;

	@Autowired
	ClientService clientService;

	@PreAuthorize("hasAuthority('LIST_APPOINTMENTS')")
	@GetMapping
	public String listAppointments(Model model) {

		List<Appointment> appointments = appointmentService.getAppointments();
		List<Client> clients = clientService.getClients();

		model.addAttribute("appointments", appointments);
		model.addAttribute("clients", clients);
		return "appointments/listAppointments";
	}

	@PreAuthorize("hasAuthority('GET_APPOINTMENT')")
	@GetMapping("/{id}")
	public String getAppointment(@PathVariable("id") String id, Model model,
			@RequestParam(name = "clientId", required = false) Integer clientId,
			@RequestParam(name = "saved", required = false) boolean saved) {

		model.addAttribute("fromClientPage", clientId != null);
		model.addAttribute("saved", saved);

		if (id.equals("new") && clientId == null) {
			throw new IllegalArgumentException("Cannot add a new appointment without a clientid");
		}

		AppointmentCommand appointmentCommand;

		if (id.equals("new")) {
			appointmentCommand = new AppointmentCommand(clientId);
		} else {

			Appointment appointment = appointmentService.getAppointment(id);

			appointmentCommand = new AppointmentCommand(appointment);
		}

		Client client = clientService.getClient(appointmentCommand.getClientId());

		appointmentCommand.setClient(client);

		model.addAttribute("command", appointmentCommand);
		return "appointments/editAppointment";
	}

	@PreAuthorize("hasAuthority('SAVE_APPOINTMENT')")
	@PostMapping("/save")
	public String saveAppointment1(@RequestBody AppointmentCommand command) {

		appointmentService.saveAppointment(command);

		return "redirect:/appointments/";
	}

	@PreAuthorize("hasAuthority('SAVE_APPOINTMENT')")
	@PostMapping
	public String saveAppointment(AppointmentCommand command, RedirectAttributes redirectAttributes,
			boolean fromClientPage) {

		Appointment appointment = appointmentService.saveAppointment(command);

		redirectAttributes.addAttribute("saved", true);
		if (fromClientPage) {
			redirectAttributes.addAttribute("clientId", appointment.getClientId());
		}
		return "redirect:/appointments/" + appointment.getId();
	}

	@PreAuthorize("hasAuthority('DELETE_APPOINTMENT')")
	@DeleteMapping("/{id}/delete")
	public String deleteAppointment(@PathVariable("id") String id,
			@RequestParam(name = "clientId", required = false) Integer clientId, RedirectAttributes redirectAttributes) {

		appointmentService.deleteAppointment(id);

		redirectAttributes.addFlashAttribute("deleted", true);

		if (clientId != null) {
			return "redirect:/clients/" + clientId;
		}
		return "redirect:/appointments";

	}

	@PreAuthorize("hasAuthority('DELETE_APPOINTMENT')")
	@DeleteMapping("/{id}")
	public String deleteAppointment(@PathVariable("id") String id) {

		appointmentService.deleteAppointment(id);

		return "redirect:/appointments";

	}
}
