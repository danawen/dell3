package springapp.command;

import springapp.domain.Appointment;
import springapp.domain.Client;

public class AppointmentCommand {

	private Integer id;
	private String start;
	private String end;
	private String title;
	private String backgroundColor;
	private Integer clientId;
	private Client client;

	public AppointmentCommand() {
	}

	public AppointmentCommand(Integer clientId) {
		this.clientId = clientId;
	}

	public AppointmentCommand(Appointment appointment) {
		if (appointment != null) {
			this.clientId = appointment.getClientId();
			this.id = appointment.getId();
			this.start = appointment.getStart();
			this.end = appointment.getEnd();
			this.title = appointment.getTitle();
			this.backgroundColor = appointment.getBackgroundColor();
		}
	}

	/**
	 * @return the backgroundColor
	 */
	public String getBackgroundColor() {
		return backgroundColor;
	}

	/**
	 * @param backgroundColor the backgroundColor to set
	 */
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the end
	 */
	public String getEnd() {
		return end;
	}

	/**
	 * @param end the end to set
	 */
	public void setEnd(String end) {
		this.end = end;
	}

	/**
	 * @return the start
	 */
	public String getStart() {
		return start;
	}

	/**
	 * @param start the start to set
	 */
	public void setStart(String start) {
		this.start = start;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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