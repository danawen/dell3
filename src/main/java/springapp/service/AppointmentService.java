package springapp.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springapp.command.AppointmentCommand;
import springapp.dao.AppointmentDao;
import springapp.domain.Appointment;
import springapp.domain.Client;

@Service
public class AppointmentService {
	
	@Autowired 
	AppointmentDao appointmentDao;
	
	public List<Appointment> getAppointments(){
		return appointmentDao.list();
		
	}

	public void deleteAppointment(String id) {
		appointmentDao.delete(Integer.parseInt(id));
	}

	public Appointment getAppointment(String id) {
		return appointmentDao.get(Integer.parseInt(id));
	}
	
	public Appointment saveAppointment(AppointmentCommand command) {
		Appointment newAppointment = new Appointment(command.getId(), command.getStart(), command.getEnd(), command.getTitle(), command.getBackgroundColor(), command.getClientId());
		return appointmentDao.save(newAppointment);
	}
}