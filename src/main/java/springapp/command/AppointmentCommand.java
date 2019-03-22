package springapp.command;



import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import springapp.domain.Appointment;
import springapp.domain.Client;


public class AppointmentCommand {
	
	private Integer id;
	private String date;
	private String time;
	private Integer clientId;
	private Client client;
	private DateTimeFormatter dateFormatter;
	
	
	public AppointmentCommand(Integer clientId) {
		this.clientId = clientId;
	}

	public AppointmentCommand(Appointment appointment) {
		if (appointment != null) {
			this.clientId = appointment.getClientId();
			this.id = appointment.getId();
			this.date = appointment.getDate().format(dateFormatter);
			this.time = appointment.getTime();
		}
	}
	
	public AppointmentCommand() {
		dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public String getTime() {
		return time;
	}
	
	public void setTime(String time) {
		this.time = time;
	}
	
	public Client getClient() {
		return client;
	}
	
	public void setClient(Client client) {
		this.client = client;
	}
	
	public Integer getClientId() {
		return clientId;
	}
	
	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}
}